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
import { OrdersModule } from './orders/orders.module';
import { RolesModule } from './roles/roles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DataSource } from 'typeorm';
import { Role } from './roles/entities/role.entity';
import { User } from './users/entities/user.entity';
import { hashSync } from 'bcrypt';
import { AddressesModule } from './addresses/addresses.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { DishesModule } from './dishes/dishes.module';
import { NestMinioModule } from 'nestjs-minio';
import { Address } from './addresses/entities/address.entity';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Dish } from './dishes/entities/dish.entity';

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
    ThrottlerModule.forRoot([
      {
        ttl: 2000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.SQL_HOST,
      port: Number(process.env.SQL_PORT) ?? 5432,
      username: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB,
      autoLoadEntities: true,

      // Somente quando em ambiente de desenvolvimento
      logging: process.env.ENV === 'dev',
      synchronize: process.env.ENV === 'dev',
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
    NestMinioModule.register({
      isGlobal: true,
      endPoint: process.env.BUCKET_HOST!,
      port: Number(process.env.BUCKET_PORT!),
      accessKey: process.env.BUCKET_ACCESS_KEY!,
      secretKey: process.env.BUCKET_SECRET_KEY!,
      useSSL: false,
    }),
    AddressesModule,
    AuthModule,
    DishesModule,
    RestaurantsModule,
    OrdersModule,
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
    const plainPassword: string = 'vivasabor123';
    const hashPassword: string = hashSync(
      plainPassword,
      process.env.ENCRYPT_SALT!,
    );

    const plainGraoDiretoPassword: string = '123Fred';
    const hashGraoDiretoPassword: string = hashSync(
      plainGraoDiretoPassword,
      process.env.ENCRYPT_SALT!,
    );

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
          password: hashGraoDiretoPassword,
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
      .insert()
      .into(Restaurant)
      .values([
        {
          id: '40cba349-8c60-4fa3-be6d-728d77f39396',
          cnpj: '00987654321',
          email: 'jocaL@mail.com',
          minimumFee: 2_00,
          nomeFantasia: 'Joca Lanches',
          phoneNumber: '+5515912365412',
          razaoSocial: 'Joaquim Barbosa Comercios Alimenticios S/A',
        },
        {
          id: 'e639667c-7afe-47cb-a781-63f36f3dfeef',
          cnpj: '12345678900',
          email: 'kotb@mail.com',
          minimumFee: 9_215_00,
          nomeFantasia: 'King of the Burguer',
          phoneNumber: '+5564933223232',
          razaoSocial: 'Hamburgueria Costa da Silva LTDA.',
        },
      ])
      .orIgnore()
      .execute();

    this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Address)
      .values([
        {
          id: 'd24e206f-5f41-46d7-a863-4d058ed27759',
          block: 'Pão de Queijo',
          city: 'Araxá',
          country: 'Brasil',
          number: '125',
          postalCode: '12365478',
          state: 'Minas Gerais',
          street: 'Dos Alegres',
          uf: 'MG',
        },
        {
          id: 'd0a53947-7c7f-4b3f-920d-340cb64e87c6',
          block: 'Bonfim',
          city: 'São José do Rio Preto',
          country: 'Brasil',
          number: '001',
          postalCode: '25845613',
          state: 'Goiás',
          street: 'Das Folias',
          uf: 'GO',
        },
        {
          id: '76d5fc36-77fd-4a24-9317-457d90160ba7',
          block: 'Veredas',
          city: 'Nova Friburgo',
          country: 'Brasil',
          number: '52',
          postalCode: '64973128',
          state: 'Goiás',
          street: 'Da Paixão',
          uf: 'GO',
        },
        {
          id: '6f43051e-ca1a-4b92-b919-b0704e0175ab',
          block: 'Passo Fundo',
          city: 'Cuiabá',
          country: 'Brasil',
          number: '4467',
          postalCode: '74185524',
          state: 'Mato Grosso',
          street: 'Das Araras',
          uf: 'MT',
        },
        {
          id: 'ae2bdc94-4990-4727-acec-8fb3d01b093d',
          block: 'Bourdon',
          city: 'Micenas',
          country: 'Brasil',
          number: '4557',
          postalCode: '78978978',
          state: 'Mato Grosso do Sul',
          street: 'Da Saudade',
          uf: 'MS',
        },
        {
          id: 'e8eec262-cd0d-41e8-b0e3-dd59f4bf962b',
          block: 'Cambotá',
          city: 'Friburgo',
          country: 'Brasil',
          number: '678',
          postalCode: '45645645',
          state: 'Roraima',
          street: 'Das Alamedas',
          uf: 'RR',
        },
        {
          id: 'be87e018-0550-48b3-88cb-c1b907e82778',
          block: 'Abobado',
          city: 'Brasileirinho',
          country: 'Brasil',
          complement: 'Casa Engraçada',
          number: '0',
          postalCode: '12312312',
          state: 'Acre',
          street: 'Dos Bobos',
          uf: 'AC',
        },
      ])
      .orIgnore()
      .execute();

    this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Dish)
      .values([
        {
          id: 'f5ddf192-213b-48a8-b6aa-ae938decf55b',
          category: 'Bebidas',
          discount: 99,
          description: 'Aquela que desce redondo',
          name: 'SKOL Lata 350ml',
          price: 8_00,
        },
        {
          id: '8838d6e2-34b0-4072-8ad7-b72d0412a4b6',
          category: 'Bebidas',
          description: 'A mais refrescante do Brasil',
          name: 'Coca-Cola Lata 350ml',
          price: 6_00,
        },
        {
          id: '9300df6f-41dc-4d4b-b841-ab704dea5f0b',
          category: 'Massas',
          discount: 4_89,
          description: 'Pizza 6 fatias',
          name: 'Pizza Doce',
          price: 60_00,
        },
        {
          id: 'f10f30f9-7c3b-4281-81f1-e51d3ddb6755',
          category: 'Populares',
          discount: 59,
          description: 'Pipoca agridoce',
          name: 'Pipoca Caramelizada com Sal',
          price: 10_00,
        },
        {
          id: 'd67ed364-e90a-431f-9de0-b2baf8dd8f7a',
          category: 'Populares',
          discount: 1_29,
          description: 'Chocolate ao Leite e Morango',
          name: 'Pastel Sensação',
          price: 11_50,
        },
        {
          id: '76fae4b3-bdf8-4b17-8960-5c4511eb752b',
          category: 'Vegetarianos',
          description: 'O lanche mais vegano que você vai ver',
          name: 'Podrão Veggie',
          price: 32_00,
        },
        {
          id: 'b662e4b8-c58f-48df-b3f5-1f318efe86c1',
          category: 'Promoções',
          discount: 15_79,
          description: 'O prato feito mais completo do mercado',
          name: 'Prato Feito Macarronada',
          price: 22_00,
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

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'dishes')
      .of('40cba349-8c60-4fa3-be6d-728d77f39396')
      .addAndRemove(
        'f5ddf192-213b-48a8-b6aa-ae938decf55b',
        'f5ddf192-213b-48a8-b6aa-ae938decf55b',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'dishes')
      .of('40cba349-8c60-4fa3-be6d-728d77f39396')
      .addAndRemove(
        '8838d6e2-34b0-4072-8ad7-b72d0412a4b6',
        '8838d6e2-34b0-4072-8ad7-b72d0412a4b6',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'dishes')
      .of('e639667c-7afe-47cb-a781-63f36f3dfeef')
      .addAndRemove(
        '9300df6f-41dc-4d4b-b841-ab704dea5f0b',
        '9300df6f-41dc-4d4b-b841-ab704dea5f0b',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'dishes')
      .of('e639667c-7afe-47cb-a781-63f36f3dfeef')
      .addAndRemove(
        'f10f30f9-7c3b-4281-81f1-e51d3ddb6755',
        'f10f30f9-7c3b-4281-81f1-e51d3ddb6755',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'dishes')
      .of('e639667c-7afe-47cb-a781-63f36f3dfeef')
      .addAndRemove(
        'd67ed364-e90a-431f-9de0-b2baf8dd8f7a',
        'd67ed364-e90a-431f-9de0-b2baf8dd8f7a',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'dishes')
      .of('e639667c-7afe-47cb-a781-63f36f3dfeef')
      .addAndRemove(
        '76fae4b3-bdf8-4b17-8960-5c4511eb752b',
        '76fae4b3-bdf8-4b17-8960-5c4511eb752b',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'dishes')
      .of('e639667c-7afe-47cb-a781-63f36f3dfeef')
      .addAndRemove(
        'b662e4b8-c58f-48df-b3f5-1f318efe86c1',
        'b662e4b8-c58f-48df-b3f5-1f318efe86c1',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(User, 'addresses')
      .of('5119a9bf-aec7-42e1-8123-e2ad4c5449b0')
      .addAndRemove(
        'be87e018-0550-48b3-88cb-c1b907e82778',
        'be87e018-0550-48b3-88cb-c1b907e82778',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(User, 'addresses')
      .of('5119a9bf-aec7-42e1-8123-e2ad4c5449b0')
      .addAndRemove(
        'e8eec262-cd0d-41e8-b0e3-dd59f4bf962b',
        'e8eec262-cd0d-41e8-b0e3-dd59f4bf962b',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(User, 'addresses')
      .of('6e04803e-b1fd-4cf2-a635-9f07f137aa65')
      .addAndRemove(
        'ae2bdc94-4990-4727-acec-8fb3d01b093d',
        'ae2bdc94-4990-4727-acec-8fb3d01b093d',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(User, 'addresses')
      .of('cc624950-2644-4e64-9fb3-87adb2f7e208')
      .addAndRemove(
        '6f43051e-ca1a-4b92-b919-b0704e0175ab',
        '6f43051e-ca1a-4b92-b919-b0704e0175ab',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(User, 'addresses')
      .of('81913100-9e53-43a6-8b1c-e74661249806')
      .addAndRemove(
        '76d5fc36-77fd-4a24-9317-457d90160ba7',
        '76d5fc36-77fd-4a24-9317-457d90160ba7',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'addresses')
      .of('e639667c-7afe-47cb-a781-63f36f3dfeef')
      .addAndRemove(
        'd0a53947-7c7f-4b3f-920d-340cb64e87c6',
        'd0a53947-7c7f-4b3f-920d-340cb64e87c6',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'addresses')
      .of('40cba349-8c60-4fa3-be6d-728d77f39396')
      .addAndRemove(
        'd24e206f-5f41-46d7-a863-4d058ed27759',
        'd24e206f-5f41-46d7-a863-4d058ed27759',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'employees')
      .of('40cba349-8c60-4fa3-be6d-728d77f39396')
      .addAndRemove(
        '6e04803e-b1fd-4cf2-a635-9f07f137aa65',
        '6e04803e-b1fd-4cf2-a635-9f07f137aa65',
      );

    this.dataSource
      .createQueryBuilder()
      .relation(Restaurant, 'employees')
      .of('e639667c-7afe-47cb-a781-63f36f3dfeef')
      .addAndRemove(
        'cc624950-2644-4e64-9fb3-87adb2f7e208',
        'cc624950-2644-4e64-9fb3-87adb2f7e208',
      );
  }
}
