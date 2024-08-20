import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Auditable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { DishCategoryType } from '../types/dish-category.type';

@Entity('Dish')
export class Dish extends Auditable {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({
    name: 'category',
    type: 'enum',
    enum: [
      'Bebidas',
      'Lanches',
      'Massas',
      'Populares',
      'Promoções',
      'Refeições',
      'Saladas',
      'Sobremesas',
      'Vegetarianos',
    ],
    default: 'Refeições',
  })
  category: DishCategoryType;

  @Column({ name: 'price', type: 'int8' })
  price: number;

  @Column({ name: 'discount', nullable: true, type: 'int8' })
  discount?: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.dishes, {
    nullable: true,
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Relation<Restaurant>;
}
