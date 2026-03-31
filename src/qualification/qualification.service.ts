import { Injectable } from '@nestjs/common';
import { Qualification } from './qualification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QualificationService {
  constructor(
    @InjectRepository(Qualification)
    private qualificationRepo: Repository<Qualification>,
  ) {}

  async findAll() {
    return this.qualificationRepo.find();
  }
}
