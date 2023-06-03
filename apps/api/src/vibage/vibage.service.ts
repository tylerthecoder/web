import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import SpotifyService from "src/services/spotify.service";
import { SearchTrack, VibageTrack, Vibe, VibeDocument } from "./vibage.schema";

@Injectable()
export class VibageService {

	constructor(
		private spotifyService: SpotifyService,
		@InjectModel(Vibe.name) private vibeModel: Model<VibeDocument>,
	) {
	}

	public async getVibe(vibeId: string) {
		const vibes = await this.vibeModel.find();
		const vibe = vibes[0];
		this.spotifyService.auth(vibe.spotifyCredentials);
		this.spotifyService.setOnTokenRefresh(async (tokens) => {
			const vibe = await this.getVibe(vibeId);
			console.log("Refreshing Spotify Access Token");
			vibe.spotifyCredentials = tokens;
			await vibe.save();
		})
		return vibe;
	}

	/** Starts a vibe for a host */
	/** For now it will just start vibage for me */

	async startVibe() {
		const vibe = await this.getVibe("");

		// Start playing playlist
		await this.spotifyService.call(api => api.play({
			// eslint-disable-next-line @typescript-eslint/camelcase
			context_uri: `spotify:playlist:${vibe.playlistId}`,
		}));
	}

	async addTrackToVibe(spotifyTrackId: string) {
		const vibe = await this.getVibe("");

		console.log("Adding Track", spotifyTrackId);

		const spotifyTrack = await this.spotifyService.call(api => api.getTrack(spotifyTrackId));
		const vibageTrack = new VibageTrack(spotifyTrack);

		vibe.tracks.push(vibageTrack);

		vibe.tracks.sort((a, b) => b.likes.length - a.likes.length);

		await vibe.update({
			$set: {
				tracks: vibe.tracks,
			}
		})

		await this.reorderPlaylist();

		return vibe;
	}

	async likeTrack(trackId: string) {
		const vibe = await this.getVibe("");

		console.log(vibe);

		const track = vibe.tracks.find(track => track.trackId === trackId);

		if (!track) {
			throw new Error("Track not found");
		}

		track.likes.push({
			userId: "me",
			time: Date.now(),
			displayName: "Me",
		});

		vibe.tracks.sort((a, b) => b.likes.length - a.likes.length);

		await vibe.update({
			$set: {
				tracks: vibe.tracks,
			}
		})

		this.reorderPlaylist();

		await vibe.save();
		return vibe;
	}

	async reorderPlaylist() {
		const vibe = await this.getVibe("");
		const trackUris = vibe.tracks.map(track => `spotify:track:${track.trackId}`);
		await this.spotifyService.call(api => api.replaceTracksInPlaylist(vibe.playlistId, trackUris));
	}

	async playNextSong() {
		const vibe = await this.getVibe("");

		const song = vibe.tracks.shift();

		if (!song) {
			console.log("No songs in queue")
			return;
		}
	}

	async getAllVibes() {
		const vibes = await this.vibeModel.find();
		console.log(vibes);
	}

	async search(text: string) {
		await this.getVibe("");
		if (text.length < 1) {
			return [];
		}
		console.log("Searching for", text);
		const results = await this.spotifyService.call(api => api.searchTracks(text));

		if (!results.tracks) {
			return [];
		}

		const searchTracks = results.tracks.items.map(SearchTrack.fromSpotifyTrack);

		return searchTracks;
	}


}