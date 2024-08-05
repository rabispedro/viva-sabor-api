import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CredentialsModule } from './credentials/credentials.module';
import { ConfigModule } from '@nestjs/config';
// import Joi from 'joi';

@Module({
  imports: [
    UsersModule,
    CredentialsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.stg', '.env.prd'],
      isGlobal: true,
      cache: true,
      // validationSchema: Joi.object({
      // ENV: Joi.string().valid('dev', 'stg', 'prd').default('dev').required(),
      // API_PORT: Joi.number().port().default(3000).required(),
      // SQL_DB: Joi.string().default('postgre').required(),
      // SQL_USER: Joi.string().required(),
      // SQL_PASSWORD: Joi.string().required(),
      // SQL_HOST: Joi.string().default('localhost').required(),
      // SQL_PORT: Joi.number().port().default(5432).required(),
      // }),
      validationOptions: {
        allowUnkown: true,
        abortEarly: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
