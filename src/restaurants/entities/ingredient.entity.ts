import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Item } from './item.entity';
import { UUID } from 'crypto';

@Entity('Ingredient')
export class Ingredient {
  @PrimaryColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @ManyToOne(() => Item, (item) => item.ingredients)
  item: Item;

  constructor() {
    if (!this.id) this.id = crypto.randomUUID();
  }
}
