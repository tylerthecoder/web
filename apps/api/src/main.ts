import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { NestApplicationOptions } from '@nestjs/common';
import { app, setApp } from './app';


async function bootstrap() {
  const options: NestApplicationOptions = {}

  if (process.env.HTTPS_ENABLED) {
    console.log("Making sever https")
    const httpsKeyPath = process.env.HTTPS_KEY_PATH
    const httpsPemPath = process.env.HTTPS_PEM_PATH

    if (!httpsKeyPath || !httpsPemPath) {
      throw new Error("HTTPS_KEY_PATH and HTTPS_PEM_PATH must be set")
    }

    options.httpsOptions = {
      key: readFileSync(httpsKeyPath),
      cert: readFileSync(httpsPemPath)
    }
  }

  setApp(await NestFactory.create(AppModule, options));
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tgt API')
    .setDescription('my api')
    .build()


  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const config = app.get(ConfigService)

  const port = config.get('PORT') ?? 3000;

  console.log("Listening on port: ", port);


  await app.listen(port);
}
bootstrap();
