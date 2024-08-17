import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDishDto } from './create-dish.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { DishCategoryType } from '../types/dish-category.type';

export class UpdateDishDto extends PartialType(CreateDishDto) {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: DishCategoryType;

  @ApiProperty()
  restaurant: Restaurant;

  @ApiProperty()
  price: number;

  @ApiProperty()
  discount?: number;

  @ApiProperty()
  imageUrl?: string;
}
