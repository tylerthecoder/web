import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppService } from "src/app.service";
import { AppServiceDocument } from "src/schemas/AppService";
import { Creation, CreationDocument } from "src/schemas/Creation.schema";
import SpotifyService from "src/services/spotify.service";

@Injectable()
export class MeService {
	constructor(
		private spotifyService: SpotifyService,
		@InjectModel(AppService.name) private appServiceDb: Model<AppServiceDocument>,
		@InjectModel(Creation.name) private creationModel: Model<CreationDocument>,
	) { }

	async creations() {
		return this.creationModel.find();
	}

	async addCreation(creation: Creation) {
		const doc = new this.creationModel(creation);
		await doc.save();
	}

	private async authSpotify() {
		const spotify = await this.appServiceDb.findOne({ name: "spotify" });

		if (!spotify) {
			throw new Error("Spotify service not found not found");
		}

		this.spotifyService.auth({
			accessToken: spotify.access_token,
			refreshToken: spotify.refresh_token
		});

		const tokens = await this.spotifyService.api.refreshAccessToken();

		this.spotifyService.auth({
			accessToken: tokens.body.access_token,
			refreshToken: tokens.body.refresh_token!,
		});
	}

	public async authorizeSpotifyCode(code: string) {
		const tokens = await this.spotifyService.authorizeCode(code);
		await this.appServiceDb.updateOne({ name: "spotify" }, {
			"access_token": tokens.accessToken,
			"refresh_token": tokens.refreshToken,
		});
		console.log("Spotify code updated!")
	}


	async listeningTo() {
		await this.authSpotify();
		return this.spotifyService.getCurrentSong();
	}

	async getDevices() {
		await this.authSpotify();
		const devices = await this.spotifyService.api.getMyDevices()
		console.log(devices.body.devices);
	}


}