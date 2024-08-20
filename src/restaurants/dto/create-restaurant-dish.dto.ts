import { ApiProperty } from '@nestjs/swagger';
import { DishCategoryType } from 'src/dishes/types/dish-category.type';
import { IsNumber, IsString } from 'class-validator';

export class CreateRestaurantDishDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  category: DishCategoryType;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  discount?: number;

  @ApiProperty()
  imageUrl?: string;
}
