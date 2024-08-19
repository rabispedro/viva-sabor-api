import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Address } from 'src/addresses/entities/address.entity';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [TypeOrmModule.forFeature([Restaurant, Address])],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
