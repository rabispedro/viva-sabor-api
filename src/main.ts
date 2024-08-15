import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { HttpExceptionFilter } from './shared/filters/http.exception.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RolesModule } from './roles/roles.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get('API_PORT') ?? 3000;

  //  Api Versioning Config
  // app.enableVersioning({
  //   type: VersioningType.URI,
  // });

  //  Swagger Documentation
  const documentConfig = new DocumentBuilder()
    .setTitle('Viva Sabor API')
    .setDescription(
      'API monolítica Viva Sabor para a plataforma de gastronomia do desafio Grão Direto',
    )
    .setVersion('1.0.0')
    .addTag('app')
    .addTag('auth')
    .addTag('ingredients')
    .addTag('items')
    .addTag('orders')
    .addTag('restaurants')
    .addTag('roles')
    .addTag('users')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig, {
    include: [
      AuthModule,
      IngredientsModule,
      ItemsModule,
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
