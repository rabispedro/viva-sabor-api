import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UUID } from 'crypto';
import { Order } from 'src/orders/schemas/order.entity';

@Entity('Ingredient')
export class Ingredient {
  @PrimaryColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @Column()
  aditionalPrice: number;

  @ManyToOne(() => Order, (order) => order.aditionals)
  order: Order;

  constructor() {
    if (!this.id) this.id = crypto.randomUUID();
  }
}
