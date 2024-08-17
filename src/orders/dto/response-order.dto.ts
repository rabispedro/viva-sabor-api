import { ApiProperty } from '@nestjs/swagger';
import { ResponseDishDto } from 'src/dishes/dto/response-dish.dto';
import { ResponseRestaurantDto } from 'src/restaurants/dto/response-restaurant.dto';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';

export class ResponseOrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  buyer: ResponseUserDto;

  @ApiProperty()
  restaurant: ResponseRestaurantDto;

  @ApiProperty()
  fee?: number;

  @ApiProperty()
  discount?: number;

  @ApiProperty()
  dishes: ResponseDishDto[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  createdAt: Date;
}
