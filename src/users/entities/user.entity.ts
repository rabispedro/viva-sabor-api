import { Address } from 'src/addresses/entities/address.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Auditable } from 'src/shared/entities/auditable.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Relation,
} from 'typeorm';

@Entity('User')
export class User extends Auditable {
  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'birth_date', nullable: false })
  birthDate: Date;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true, unique: true })
  phoneNumber: string;

  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl?: string;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable({
    name: 'User_Role',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  roles: Relation<Role>[];

  @ManyToMany(() => Address, (address: Address) => address.users, {
    cascade: true,
  })
  @JoinTable({
    name: 'User_Address',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'address_id',
    },
  })
  addresses: Relation<Address>[];

  @ManyToOne(
    () => Restaurant,
    (restaurant: Restaurant) => restaurant.employees,
    { nullable: true },
  )
  @JoinColumn({
    name: 'restaurant_id',
  })
  restaurant: Relation<Restaurant>;
}
