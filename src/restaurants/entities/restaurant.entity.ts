import { UUID } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity('Restaurant')
export class Restaurant {
  @PrimaryColumn('uuid')
  id: UUID;

  // @Column()
  // razaoSocial: string;

  @Column()
  nomeFantasia: string;

  @Column()
  cnpj: string;

  @Column()
  imageUrl?: string;

  @Column()
  bannerImageUrl?: string;

  @ManyToMany(() => User)
  @JoinColumn()
  managers: User[];

  @OneToMany(() => Item, (item) => item.restaurant)
  items: Item[];

  @Column()
  minimumFee: number;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) this.id = crypto.randomUUID();
  }
}
