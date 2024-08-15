import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;
}
