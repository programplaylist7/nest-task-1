import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { OneToOne, JoinColumn } from 'typeorm';
import { UserDetails } from '../user-details/user-details.entity';

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
}
