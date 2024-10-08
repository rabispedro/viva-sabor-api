import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDishDto } from './create-dish.dto';
import { DishCategoryType } from '../types/dish-category.type';
import { IsNumber, IsString } from 'class-validator';

export class UpdateDishDto extends PartialType(CreateDishDto) {
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
