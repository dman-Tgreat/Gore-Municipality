import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


@Entity('news')

export class Document {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
    length: 255,
    })
    title!: string;

    @Column({
    length: 255,
    })
    description!: string;

    @Column({
    type: 'text',
    })
    fileUrl!: string;

    @Column({
    type: 'text',
    })
    category!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
