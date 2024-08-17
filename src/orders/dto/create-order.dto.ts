import { ApiProperty } from '@nestjs/swagger';
import { Dish } from 'src/dishes/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateOrderDto {
  @ApiProperty()
  buyer: User;

  @ApiProperty()
  restaurant: Restaurant;

  @ApiProperty()
  fee?: number;

  @ApiProperty()
  discount?: number;

  @ApiProperty()
  dishes: Dish[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  createdAt: Date;
}
