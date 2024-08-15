import { UUID } from 'crypto';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('Role')
export class Role {
  @PrimaryColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @Column()
  description: string;

  // @ManyToMany(() => User, (user: User) => user.roles)
  // user: User;

  constructor() {
    if (!this.id) this.id = crypto.randomUUID();
  }
}
