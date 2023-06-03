import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import SpotifyService from "src/services/spotify.service";
import { VibageController } from "./vibage.controller";
import { Vibe, VibeSchema } from "./vibage.schema";
import { VibageService } from "./vibage.service";


@Module({
	imports: [
		MongooseModule.forFeature([{ name: Vibe.name, schema: VibeSchema }]),
	],
	providers: [
		ConfigService,
		SpotifyService,
		VibageService,
	],
	controllers: [
		VibageController
	],
})
export class VibageModule { }