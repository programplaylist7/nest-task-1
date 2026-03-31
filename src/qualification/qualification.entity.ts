import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Qualification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // comment: qualification name

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;
}
