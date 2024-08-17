import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { HttpExceptionFilter } from './shared/filters/http.exception.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RolesModule } from './roles/roles.module';
import { AddressesModule } from './addresses/addresses.module';
import { AppController } from './app.controller';
import helmet from 'helmet';
import { DishesModule } from './dishes/dishes.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    cors: true,
  });

  app.use(helmet());

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get('API_PORT') ?? 3000;

  //  Swagger Documentation
  const documentConfig = new DocumentBuilder()
    .setTitle('Viva Sabor API')
    .setDescription(
      'API monolítica Viva Sabor para a plataforma de gastronomia do desafio Grão Direto',
    )
    .setVersion('1.0.0')
    .addTag('addresses')
    .addTag('app')
    .addTag('auth')
    .addTag('dishes')
    .addTag('orders')
    .addTag('restaurants')
    .addTag('roles')
    .addTag('users')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig, {
    include: [
      AppController,
      AddressesModule,
      AuthModule,
      DishesModule,
      OrdersModule,
      RestaurantsModule,
      RolesModule,
      UsersModule,
    ],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('swagger', app, document);

  //  Global Middlewares
  app.use(LoggerMiddleware);

  //  Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
}
bootstrap();
