import { ApiProperty } from '@nestjs/swagger';
import { DishCategoryType } from '../types/dish-category.type';
import { IsNumber, IsString } from 'class-validator';

export class CreateDishDto {
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
