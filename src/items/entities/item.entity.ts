import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Item')
export class Item {
  @PrimaryColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @Column()
  description: string;

  // @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
  // restaurant: Restaurant;

  @Column()
  price: number;

  @Column()
  discount?: number;

  @Column()
  image_url?: string;

  @Column()
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) this.id = crypto.randomUUID();
  }

  getTotalPrice(): number {
    return this.price - (this.discount ?? 0);
  }
}
