import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // comment: country name

  @Column({ default: true })
  status: boolean; // comment: active/inactive

  @CreateDateColumn()
  created_at: Date;
}
