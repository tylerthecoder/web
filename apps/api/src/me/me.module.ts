
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from 'src/app.service';
import { AppServiceSchema } from 'src/schemas/AppService';
import { Creation, CreationSchema } from 'src/schemas/Creation.schema';
import SpotifyService from 'src/services/spotify.service';
import { MeController } from './me.controller';
import { MeService } from './me.service';


@Module({
	imports: [
		MongooseModule.forFeature([{ name: AppService.name, schema: AppServiceSchema }, { name: Creation.name, schema: CreationSchema }]),
	],
	controllers: [MeController],
	providers: [MeService, SpotifyService, ConfigService],
})
export class MeModule { }