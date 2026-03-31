import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Designation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // comment: designation name

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;
}
