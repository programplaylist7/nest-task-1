import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Country } from '../country/country.entity';

@Entity()
export class UserDetails {
  @PrimaryGeneratedColumn()
  id: number;

  // comment: user owns the relation (important)
  @OneToOne(() => User, (user) => user.userDetails)
  @JoinColumn({ name: 'user_id' }) // ✅ ONLY HERE
  user: User;

  // comment: country relation
  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column()
  full_name: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  mobile_number: string;

  @Column()
  profile_picture: string;

  @Column()
  total_experience: string;

  @Column('text')
  key_skills: string;

  @CreateDateColumn()
  created_at: Date;
}
