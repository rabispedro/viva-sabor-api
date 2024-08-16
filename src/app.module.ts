import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './shared/guards/auth.guard';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';
import { RolesModule } from './roles/roles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DataSource } from 'typeorm';
import { Role } from './roles/entities/role.entity';
import { User } from './users/entities/user.entity';
import { hashSync } from 'bcrypt';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.stg', '.env.prd'],
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        // App Config
        ENV: Joi.string().valid('dev', 'stg', 'prd').default('dev').required(),
        API_PORT: Joi.number().port().default(3000).required(),

        // SQL Database Config
        SQL_DB: Joi.string().default('postgre').required(),
        SQL_USER: Joi.string().required(),
        SQL_PASSWORD: Joi.string().required(),
        SQL_HOST: Joi.string().default('localhost').required(),
        SQL_PORT: Joi.number().port().default(5432).required(),

        // NO-SQL Database Config
        NOSQL_DB: Joi.string().default('mongodb').required(),
        NOSQL_USER: Joi.string().required(),
        NOSQL_PASSWORD: Joi.string().required(),
        NOSQL_HOST: Joi.string().default('localhost').required(),
        NOSQL_PORT: Joi.number().port().default(27017).required(),

        // Cache Database Config
        CACHE_HOST: Joi.string().default('localhost').required(),
        CACHE_PORT: Joi.number().port().default(6379).required(),

        // Bucket Database Config
        BUCKET_HOST: Joi.string().required().default('localhost'),
        BUCKET_PORT: Joi.string().required().default(80),
        BUCKET_ACCESS_KEY: Joi.string().required(),
        BUCKET_SECRET_KEY: Joi.string().required(),

        // Encrypt Config
        ENCRYPT_SALT: Joi.string().required(),

        // JWT Config
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('360s').required(),
      }),
      validationOptions: {
        allowUnkown: true,
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.SQL_HOST,
      port: Number(process.env.SQL_PORT) ?? 5432,
      username: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB,
      autoLoadEntities: true,
      logging: true,
      synchronize: true,
    }),
    MongooseModule.forRoot(
      // `${process.env.NOSQL_DB}://${process.env.NOSQL_USER}:${process.env.NOSQL_PASSWORD}@mongo:${process.env.NOSQL_PORT}/nest`,
      `${process.env.NOSQL_DB}://${process.env.NOSQL_HOST}:${process.env.NOSQL_PORT}`,
    ),
    CacheModule.register({
      max: 64,
      isGlobal: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: async () =>
        await redisStore({
          ttl: 60 * 60 * 12,
          socket: {
            host: process.env.CACHE_HOST,
            port: Number(process.env.CACHE_PORT) ?? 6379,
            timeout: 10000,
            keepAlive: false,
          },
        }),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    AddressesModule,
    AuthModule,
    IngredientsModule,
    ItemsModule,
    OrdersModule,
    RestaurantsModule,
    RolesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {
    const plainPassword = 'vivasabor123';
    const hashPassword = hashSync(plainPassword, process.env.ENCRYPT_SALT!);

    this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([
        {
          id: '9ed0923a-6c22-42e0-85af-76ff9781cdca',
          name: 'admin',
          description: 'Permite total controle do sistema.',
        },
        {
          id: 'a9291625-3475-453c-8e06-888ccf1434b0',
          name: 'manager',
          description: 'Permite controles do gerente.',
        },
        {
          id: '285035f3-a2d5-4a26-8c93-3361d60ec3ed',
          name: 'employee',
          description: 'Permite controles do empregado.',
        },
        {
          id: 'c9d5b839-1ea1-4242-9b4c-d7578eade02c',
          name: 'client',
          description: 'Permite controles do cliente do app.',
        },
      ])
      .orIgnore()
      .execute();

    this.dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          id: '5119a9bf-aec7-42e1-8123-e2ad4c5449b0',
          firstName: 'Fred',
          lastName: 'Grão Direto',
          password: hashPassword,
          birthDate: '2000-01-02',
          email: 'fred@graodireto.com.br',
          phoneNumber: '+5511985654515',
        },
        {
          id: '6e04803e-b1fd-4cf2-a635-9f07f137aa65',
          firstName: 'Albert',
          lastName: 'Wesker',
          password: hashPassword,
          birthDate: '1985-01-02',
          email: 'albert@mail.com',
          phoneNumber: '+5511915935784',
        },
        {
          id: 'cc624950-2644-4e64-9fb3-87adb2f7e208',
          firstName: 'Alex',
          lastName: 'André',
          password: hashPassword,
          birthDate: '2020-10-02',
          email: 'alex@mail.com',
          phoneNumber: '+5511914725874',
        },
        {
          id: '81913100-9e53-43a6-8b1c-e74661249806',
          firstName: 'Rita',
          lastName: 'Lee',
          password: hashPassword,
          birthDate: '1990-02-11',
          email: 'rita@mail.com',
          phoneNumber: '+5511933223223',
        },
      ])
      .orIgnore()
      .execute();

    this.dataSource
      .createQueryBuilder()
      .relation(User, 'roles')
      .of('5119a9bf-aec7-42e1-8123-e2ad4c5449b0')
      .addAndRemove(
        '9ed0923a-6c22-42e0-85af-76ff9781cdca',
        '9ed0923a-6c22-42e0-85af-76ff9781cdca',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(User, 'roles')
      .of('6e04803e-b1fd-4cf2-a635-9f07f137aa65')
      .addAndRemove(
        'a9291625-3475-453c-8e06-888ccf1434b0',
        'a9291625-3475-453c-8e06-888ccf1434b0',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(User, 'roles')
      .of('cc624950-2644-4e64-9fb3-87adb2f7e208')
      .addAndRemove(
        '285035f3-a2d5-4a26-8c93-3361d60ec3ed',
        '285035f3-a2d5-4a26-8c93-3361d60ec3ed',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(User, 'roles')
      .of('81913100-9e53-43a6-8b1c-e74661249806')
      .addAndRemove(
        'c9d5b839-1ea1-4242-9b4c-d7578eade02c',
        'c9d5b839-1ea1-4242-9b4c-d7578eade02c',
      );
  }
}
