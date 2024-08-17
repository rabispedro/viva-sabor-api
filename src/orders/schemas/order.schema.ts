// import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Dish } from 'src/dishes/entities/dish.entity';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ collection: 'Order' })
export class Order {
  @Prop(User)
  buyer: User;

  @Prop(Restaurant)
  restaurant: Restaurant;

  @Prop(Number)
  fee?: number;

  @Prop(Number)
  discount?: number;

  @Prop([Dish])
  dishes: Dish[];

  @Prop(Number)
  price: number;

  @Prop(Date)
  createdAt: Date;

  _doc: any;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
