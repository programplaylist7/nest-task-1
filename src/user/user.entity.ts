import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OneToOne, JoinColumn } from 'typeorm';
import { UserDetails } from '../user-details/user-details.entity';
import { Education } from 'src/education/education.entity';
import { WorkExperience } from 'src/work-experience/work-experience.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string; // comment: 'admin' or 'candidate'

  @Column({ default: false })
  is_profile_completed: boolean; // comment: track step2 completion

  @Column({ default: false })
  is_verified: boolean; // comment: email verification

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => UserDetails, (details) => details.user)
  userDetails: UserDetails;

  @OneToMany(() => Education, (edu) => edu.user)
  education: Education[];

  @OneToMany(() => WorkExperience, (exp) => exp.user)
  workExperience: WorkExperience[];
}
