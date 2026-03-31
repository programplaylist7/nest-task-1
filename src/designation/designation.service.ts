import { Injectable } from '@nestjs/common';
import { Designation } from './designation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private designationRepo: Repository<Designation>,
  ) {}

  async findAll() {
    return this.designationRepo.find();
  }
}
