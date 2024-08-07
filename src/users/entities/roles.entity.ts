import { UUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Role')
export class Role {
  @PrimaryColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @Column()
  description: string;

  constructor() {
    if (!this.id) this.id = crypto.randomUUID();
  }
}
