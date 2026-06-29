import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('hero_slide')
export class HeroSlide {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 500,
  })
  imageUrl!: string;

  @Column({
    type: 'text',
  })
  description!: string;

  @Column({
    default: 0,
  })
  sortOrder!: number;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
