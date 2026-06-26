import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity("admins")
export class Admin {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    100,
  })
  fullName!: string;

  @Column({
    unique: true,
    length:150,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    default:true,
  })
  isActive!:boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}