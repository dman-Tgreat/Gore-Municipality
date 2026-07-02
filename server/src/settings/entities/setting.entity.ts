import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('setting')
export class Setting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    length: 100,
  })
  settingKey!: string;

  @Column({
    type: 'text',
  })
  settingValue!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  settingValueom!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  settingValueam!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
