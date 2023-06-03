import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeModule } from './me/me.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HueService } from './services/hue.service';
import { VibageModule } from './vibage/vibage.module';
import { BlogModule } from './blog/blog.module';
import configuration from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("DB_URI"),
      }),
    }),
    MeModule,
    VibageModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, HueService],
})
export class AppModule { }
