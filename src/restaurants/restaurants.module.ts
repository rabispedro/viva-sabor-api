import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { Dish } from 'src/dishes/entities/dish.entity';
import { User } from 'src/users/entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [
    TypeOrmModule.forFeature([Restaurant, Address, Dish, User]),
    RolesModule,
  ],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
