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

@Entity('announcement')
export class Announcement {

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
        type: 'longtext',
      })
      content!: string;
    
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
