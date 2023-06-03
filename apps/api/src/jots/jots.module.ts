import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Creation, CreationSchema } from 'src/schemas/Creation.schema';
import SpotifyService from 'src/services/spotify.service';
import { Jot, JotSchema } from './jots.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Jot.name, schema: JotSchema }, { name: Creation.name, schema: CreationSchema }]),
	],
	controllers: [],
	providers: [SpotifyService, ConfigService],
})
export class MeModule { }