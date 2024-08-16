import { UUID } from 'crypto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Address')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'state' })
  state: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column({ name: 'uf' })
  uf: string;

  @Column({ name: 'country' })
  country: string;

  @Column({ name: 'street' })
  street: string;

  @Column({ name: 'number' })
  number: string;

  @Column({ name: 'block' })
  block: string;

  @Column({ name: 'complement', nullable: true })
  complement?: string;

  @ManyToMany(() => User, (user: User) => user.addresses)
  users: User[];

  @ManyToMany(
    () => Restaurant,
    (restaurant: Restaurant) => restaurant.addresses,
    { cascade: true },
  )
  restaurants: Restaurant[];
}
