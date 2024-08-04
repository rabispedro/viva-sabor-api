import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { HttpExceptionFilter } from './shared/filters/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  //  Global Middlewares
  app.use(LoggerMiddleware);

  //  Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
