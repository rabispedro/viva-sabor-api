import { Address } from 'src/addresses/entities/address.entity';
import { Dish } from 'src/dishes/entities/dish.entity';
import { Auditable } from 'src/shared/entities/auditable.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Relation,
} from 'typeorm';

@Entity('Restaurant')
export class Restaurant extends Auditable {
  @Column({ name: 'razao_social' })
  razaoSocial: string;

  @Column({ name: 'nome_fantasia' })
  nomeFantasia: string;

  @Column({ name: 'cnpj', unique: true })
  cnpj: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @Column({ name: 'banner_image_url', nullable: true })
  bannerImageUrl?: string;

  @Column({ name: 'minimum_fee' })
  minimumFee: number;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @OneToMany(() => User, (user: User) => user.restaurant, { cascade: true })
  employees: Relation<User>[];

  @OneToMany(() => Dish, (dish: Dish) => dish.restaurant, { cascade: true })
  dishes: Relation<Dish>[];

  @ManyToMany(() => Address, (address: Address) => address.restaurants, {
    cascade: true,
  })
  @JoinTable({
    name: 'Restaurant_Address',
    joinColumn: {
      name: 'restaurant_id',
    },
    inverseJoinColumn: {
      name: 'address_id',
    },
  })
  addresses: Relation<Address>[];
}
