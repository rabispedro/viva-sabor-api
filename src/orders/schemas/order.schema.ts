import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Item } from 'src/items/entities/item.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop(User)
  buyer: User;

  @Prop(Restaurant)
  restaurant: Restaurant;

  @Prop([Item])
  items: Item[];

  @Prop([Ingredient])
  aditionals?: Ingredient[];

  @Prop(Number)
  fee?: number;

  @Prop(Number)
  discount?: number;

  @Prop(User)
  delivery: User;

  @Prop(Number)
  price: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
