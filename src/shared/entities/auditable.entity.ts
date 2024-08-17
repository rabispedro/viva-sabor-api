import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Auditable {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt: Date;

  @Column({ name: 'is_active', nullable: false, default: true, select: false })
  isActive: boolean;
}
