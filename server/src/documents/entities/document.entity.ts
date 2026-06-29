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

@Entity('document')
export class Document {
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
    length: 255,
  })
  description!: string;

  @Column({
    length: 255,
    nullable: true,
  })
  descriptionAm!: string;

  @Column({
    length: 255,
    nullable: true,
  })
  descriptionOm!: string;

  @Column({
    type: 'text',
  })
  fileUrl!: string;

  @Column({
    type: 'text',
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
