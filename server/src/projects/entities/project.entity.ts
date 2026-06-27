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

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 255,
  })
  name!: string;

  @Column({
    type: 'text',
  })
  description!: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  budget!: number;

  @Column({
    length: 50,
    default: 'planned',
  })
  status!: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  startDate!: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  endDate!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  location!: string;

  @Column({
    nullable: true,
    length: 500,
  })
  coverImage!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  fundingSource!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  contractor!: string;

  @Column({
    length: 100,
    nullable: true,
  })
  category!: string;

  @ManyToOne(() => Admin)
  @JoinColumn({
    name: 'createdBy',
  })
  createdBy!: Admin;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
