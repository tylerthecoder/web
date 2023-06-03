import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { VibageService } from "./vibage.service";

@Controller("vibage")
export class VibageController {
	constructor(
		private readonly vibageService: VibageService,
	) { }

	@Get()
	public get() {
		return this.vibageService.getVibe("");
	}

	@Get("/search")
	public search(@Query("q") query: string) {
		return this.vibageService.search(query);
	}


	@Post("/track")
	public postTrack(@Body("trackId") trackId: string) {
		console.log(trackId);
		return this.vibageService.addTrackToVibe(trackId);
	}

	@Post("/track/:trackId/like")
	public postTrackLike(@Param("trackId") trackId: string) {
		return this.vibageService.likeTrack(trackId);
	}
}