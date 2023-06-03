import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


const findSmallestImage = (images: SpotifyApi.ImageObject[]) => {
	return images.reduce((smallest, image) => {
		if (
			smallest === undefined ||
			!smallest.width ||
			!smallest.height ||
			(image?.width ?? 0) < smallest.width ||
			(image.height ?? 0) < smallest.height
		) {
			return image;
		}

		return smallest;
	});

}

export type VibeDocument = Vibe & Document;

export class SpotifyCredentials {
	@Prop()
	accessToken!: string;

	@Prop()
	refreshToken!: string;
}

export class VibageTrackLike {
	@Prop()
	time!: number;

	@Prop()
	displayName!: string;

	@Prop()
	userId!: string;
}

export class VibageTrack {
	constructor(
		spotifyTrack: SpotifyApi.SingleTrackResponse,
	) {
		this.name = spotifyTrack.name;
		this.trackId = spotifyTrack.id;
		this.artist = spotifyTrack.artists[0].name;
		this.imageUrl = findSmallestImage(spotifyTrack.album.images).url;
		this.likes = [];
	}

	@Prop()
	name: string;

	@Prop()
	trackId: string;

	@Prop()
	artist: string;

	@Prop()
	imageUrl: string;

	@Prop()
	likes: VibageTrackLike[];
}

@Schema({
	collection: 'vibage-vibes'
})
export class Vibe {
	@Prop()
	spotifyCredentials!: SpotifyCredentials;

	@Prop()
	tracks!: VibageTrack[];

	@Prop()
	playlistId!: string;
}

export const VibeSchema = SchemaFactory.createForClass(Vibe);


export class SearchTrack {
	static fromSpotifyTrack(track: SpotifyApi.TrackObjectFull) {
		const trackName = track.name;
		const imgUrl = findSmallestImage(track.album.images).url;
		const artist = track.artists[0].name;
		const id = track.id;
		return new SearchTrack(trackName, imgUrl, artist, id);
	}

	constructor(
		private trackName: string,
		private imgUrl: string,
		private artist: string,
		private id: string
	) { }
}
