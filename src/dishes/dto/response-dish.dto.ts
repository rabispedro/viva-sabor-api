import { ApiProperty } from '@nestjs/swagger';
import { DishCategoryType } from '../types/dish-category.type';
import { UUID } from 'crypto';

export class ResponseDishDto {
  @ApiProperty()
  id: UUID;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: DishCategoryType;

  restaurantId: UUID;

  @ApiProperty()
  price: number;

  @ApiProperty()
  discount?: number;

  @ApiProperty()
  imageUrl?: string;
}
