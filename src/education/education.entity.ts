import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Qualification } from '../qualification/qualification.entity';

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  // comment: many education records → one user
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // comment: qualification relation
  @ManyToOne(() => Qualification)
  @JoinColumn({ name: 'qualification_id' })
  qualification: Qualification;

  @Column()
  specialization: string;

  @CreateDateColumn()
  created_at: Date;
}
