// comment: service handles logic and database operations

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Qualification } from '../qualification/qualification.entity';
import { Designation } from '../designation/designation.entity';
import { Country } from '../country/country.entity';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Qualification)
    private qualificationRepo: Repository<Qualification>,

    @InjectRepository(Designation)
    private designationRepo: Repository<Designation>,

    @InjectRepository(Country)
    private countryRepo: Repository<Country>,
  ) {}

  async add(type: string, name: string) {
    // comment: handle qualification
    if (type === 'qualification') {
      const data = this.qualificationRepo.create({ name });
      return this.qualificationRepo.save(data);
    }

    // comment: handle designation
    if (type === 'designation') {
      const data = this.designationRepo.create({ name });
      return this.designationRepo.save(data);
    }

    // comment: handle country
    if (type === 'country') {
      const data = this.countryRepo.create({ name });
      return this.countryRepo.save(data);
    }

    throw new BadRequestException('Invalid type');
  }
}
