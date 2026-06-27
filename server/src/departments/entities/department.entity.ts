import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


@Entity('department')
export class Department {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
    type: 'text',
    })
    name!: string;

    @Column({
    type: 'text',
    })
    description!: string;

    @Column({
    type: 'text',
    })
    head!: string;

    @Column({
    length: 50,
    })
    phone!: string;

    @Column({
    type: 'text',
    })
    email!: string;

    @Column({
    type: 'text',
    })
    office!: string;

    @Column({
    nullable: true,
    length: 500,
    })
    image!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
