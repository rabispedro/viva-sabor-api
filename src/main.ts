import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { HttpExceptionFilter } from './shared/filters/http.exception.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get('API_PORT') ?? 3000;

  //  Swagger Documentation
  const documentConfig = new DocumentBuilder()
    .setTitle('Viva Sabor API')
    .setDescription(
      'API monolítica Viva Sabor para a plataforma de gastronomia do desafio Grão Direto',
    )
    .setVersion('1.0.0')
    .addTag('users')
    .addTag('credentials')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, document);

  //  Global Middlewares
  app.use(LoggerMiddleware);

  //  Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
}
bootstrap();
