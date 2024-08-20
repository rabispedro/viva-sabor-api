import { ApiProperty } from '@nestjs/swagger';
import { DishCategoryType } from '../types/dish-category.type';
import { UUID } from 'crypto';
import { ResponseRestaurantDto } from 'src/restaurants/dto/response-restaurant.dto';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';

export class ResponseDishDto {
  @ApiProperty()
  id: UUID;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: DishCategoryType;

  @ApiProperty()
  restaurants: ResponseRestaurantDto[];

  @ApiProperty()
  users: ResponseUserDto[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  discount?: number;

  @ApiProperty()
  imageUrl?: string;
}
