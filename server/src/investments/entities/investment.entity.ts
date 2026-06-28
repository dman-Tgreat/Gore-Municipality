import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Admin } from '../../admin/entities/admin.entity';

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'longtext' })
  content!: string;

  @Column({ length: 100 })
  category!: string;

  @Column({ nullable: true, length: 500 })
  coverImage!: string;

  @Column({ nullable: true, length: 255 })
  location!: string;

  @Column({ nullable: true, length: 50 })
  contactPhone!: string;

  @Column({ nullable: true, length: 255 })
  contactEmail!: string;

  @Column({ default: true })
  published!: boolean;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'createdBy' })
  createdBy!: Admin;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
