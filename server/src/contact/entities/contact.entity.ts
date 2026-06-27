import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contact')
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 255,
  })
  name!: string;

  @Column({
    length: 255,
  })
  email!: string;

  @Column({
    length: 255,
  })
  subject!: string;

  @Column({
    type: 'text',
  })
  message!: string;

  @Column({
    default: false,
  })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
