import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './roles.entity';

@Entity('User')
export class User {
  @PrimaryColumn('uuid')
  id: UUID;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @Column()
  birthDate: Date;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  imageUrl?: string;

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
