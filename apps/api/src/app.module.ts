import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeModule } from './me/me.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HueService } from './services/hue.service';
import { VibageModule } from './vibage/vibage.module';
import configuration from './config';
import { PostsModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
    }),
    MeModule,
    VibageModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, HueService],
})
export class AppModule {}
