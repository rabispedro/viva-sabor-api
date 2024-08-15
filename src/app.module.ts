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
import { DataSource, DataSourceOptions } from 'typeorm';
import { Role } from './roles/entities/role.entity';
import { User } from './users/entities/user.entity';

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
    this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([
        {
          name: 'admin',
          description: 'Permite total controle do sistema.',
        },
        {
          name: 'manager',
          description: 'Permite controles do gerente.',
        },
        {
          name: 'employee',
          description: 'Permite controles do empregado.',
        },
        {
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
          firstName: 'Fred',
          lastName: 'Grão Direto',
          password: '$2b$10$1wOJ70S1....PcETDuHsO.LbLdCTKcEtl.OjLuTTGJu7UNNNrd0oi', //vivasabor123
          roles: () => 'admin',
          birthDate: '2000-01-02',
          email: 'fred@graodireto.com.br',
          phoneNumber: '+5511985654515',
          profileImageUrl: '',
          isActive: true,
          updatedAt: new Date().toUTCString(),
          createdAt: new Date().toUTCString(),
        },
        {
          firstName: 'Albert',
          lastName: 'Wesker',
          password: '$2b$10$1wOJ70S1....PcETDuHsO.LbLdCTKcEtl.OjLuTTGJu7UNNNrd0oi', //vivasabor123
          roles: () => 'manager',
          birthDate: '1985-01-02',
          email: 'albert@mail.com',
          phoneNumber: '+5511915935784',
          profileImageUrl: '',
          isActive: true,
          updatedAt: new Date().toUTCString(),
          createdAt: new Date().toUTCString(),
        },
        {
          firstName: 'Alex',
          lastName: 'André',
          password: '$2b$10$1wOJ70S1....PcETDuHsO.LbLdCTKcEtl.OjLuTTGJu7UNNNrd0oi', //vivasabor123
          roles: () => 'employee',
          birthDate: '2020-10-02',
          email: 'alex@mail.com',
          phoneNumber: '+5511914725874',
          profileImageUrl: '',
          isActive: true,
          updatedAt: new Date().toUTCString(),
          createdAt: new Date().toUTCString(),
        },
        {
          firstName: 'Rita',
          lastName: 'Lee',
          password: '$2b$10$1wOJ70S1....PcETDuHsO.LbLdCTKcEtl.OjLuTTGJu7UNNNrd0oi', //vivasabor123
          roles: () => 'client',
          birthDate: '1990-02-11',
          email: 'rita@mail.com',
          phoneNumber: '+5511933223223',
          profileImageUrl: '',
          isActive: true,
          updatedAt: new Date().toUTCString(),
          createdAt: new Date().toUTCString(),
        },
      ])
      .orIgnore()
      .execute();
  }
}
