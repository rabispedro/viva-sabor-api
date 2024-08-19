import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { UsersModule } from 'src/users/users.module';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService],
  imports: [
    TypeOrmModule.forFeature([Address, User]),
    UsersModule,
    RestaurantsModule,
  ],
  exports: [AddressesService],
})
export class AddressesModule {}
