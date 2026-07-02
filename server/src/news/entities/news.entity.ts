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

@Entity('news')
export class News {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 255,
  })
  title!: string;

  @Column({
    length: 255,
    nullable: true,
  })
  titleAm!: string;

  @Column({
    length: 255,
    nullable: true,
  })
  titleOm!: string;

  @Column({
    unique: true,
    length: 255,
  })
  slug!: string;

  @Column({
    type: 'text',
  })
  summary!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  summaryAm!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  summaryOm!: string;

  @Column({
    type: 'text',
  })
  content!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  contentAm!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  contentOm!: string;

  @Column({
    nullable: true,
    length: 500,
  })
  coverImage!: string;

  @Column({
    default: true,
  })
  published!: boolean;

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