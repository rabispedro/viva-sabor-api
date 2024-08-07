import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Item } from './entities/item.entity';
import { Ingredient } from './entities/ingredient.entity';
import { ItemsController } from './items.controller';
import { IngredientsController } from './ingredients.controller';
import { ItemsService } from './items.service';
import { IngredientsService } from './ingredients.service';

@Module({
  controllers: [RestaurantsController, ItemsController, IngredientsController],
  providers: [RestaurantsService, ItemsService, IngredientsService],
  imports: [TypeOrmModule.forFeature([Restaurant, Item, Ingredient])],
})
export class RestaurantsModule {}
