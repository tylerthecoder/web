import { Controller, Get, Param, Post, Query, Redirect } from "@nestjs/common";
import SpotifyService, { ICurrentlyPlayingSong } from "src/services/spotify.service";
import { MeService } from "./me.service";

@Controller("me")
export class MeController {
	constructor(
		private readonly meService: MeService,
		private readonly spotifyService: SpotifyService
	) { }

	@Get()
	get(): string {
		return "Tyler Tracy"
	}

	@Get("/creations")
	getCreations() {
		return this.meService.creations();
	}

	@Get("/listening-to")
	getListeningTo(): Promise<ICurrentlyPlayingSong> {
		return this.meService.listeningTo();
	}

	@Get("/auth-spotify")
	@Redirect()
	authSpotify() {
		const url = this.spotifyService.getAuthUrl();
		return { url, statusCode: 302 };
	}

	@Get("/spotify-callback")
	@Redirect("https://tylertracy.com")
	async spotifyCallback(@Query('code') code: string) {
		await this.meService.authorizeSpotifyCode(code);
	}


}
