import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  // // comment: define proper type for input
  async createAdmin(data: { name: string; email: string; password: string }) {
    // comment: hash password safely
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const admin = this.repo.create({
      ...data,
      password: hashedPassword,
      role: 'admin',
      is_verified: true,
    });

    return this.repo.save(admin);
  }
}
