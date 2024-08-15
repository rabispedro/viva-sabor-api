import { Role } from 'src/roles/entities/role.entity';
import { Auditable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('User')
export class User extends Auditable {
  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @Column({ name: 'birth_date', nullable: false })
  birthDate: Date;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true, unique: true })
  phoneNumber: string;

  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl?: string;

  @Column({ name: 'is_active', nullable: false, default: true, select: false })
  isActive: boolean;
}
