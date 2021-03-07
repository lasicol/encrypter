import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Encrypter')
  .setDescription('The encrypter API description')
  .setVersion('1.0')
  .addTag('encrypter')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apiDoc', app, document);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
