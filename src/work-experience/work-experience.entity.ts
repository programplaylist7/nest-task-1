import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Designation } from '../designation/designation.entity';

@Entity()
export class WorkExperience {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.workExperience, {
    onDelete: 'CASCADE', // comment: maintain data integrity
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // comment: designation relation
  @ManyToOne(() => Designation)
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

  @Column()
  organization_name: string;

  @Column()
  from_year: number;

  @Column({ nullable: true })
  to_year: number;

  @Column('text')
  job_profile: string;

  // comment: differentiate current vs past job
  @Column({ default: false })
  is_current: boolean;

  // comment: resume file path
  @Column({ nullable: true })
  resume: string;

  @CreateDateColumn()
  created_at: Date;
}
