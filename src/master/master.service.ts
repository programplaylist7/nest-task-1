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

  // comment: soft delete (set status = false)
  async delete(type: string, id: number) {
    // comment: qualification delete
    if (type === 'qualification') {
      await this.qualificationRepo.update(id, { status: false });
      return { message: 'Qualification deleted' };
    }

    // comment: designation delete
    if (type === 'designation') {
      await this.designationRepo.update(id, { status: false });
      return { message: 'Designation deleted' };
    }

    // comment: country delete
    if (type === 'country') {
      await this.countryRepo.update(id, { status: false });
      return { message: 'Country deleted' };
    }

    throw new BadRequestException('Invalid type');
  }

  // comment: get all active master data by type
  async get(type: string) {
    // comment: qualification list
    if (type === 'qualification') {
      return this.qualificationRepo.find({
        where: { status: true }, // comment: only active
        order: { id: 'DESC' }, // comment: latest first
      });
    }

    // comment: designation list
    if (type === 'designation') {
      return this.designationRepo.find({
        where: { status: true },
        order: { id: 'DESC' },
      });
    }

    // comment: country list
    if (type === 'country') {
      return this.countryRepo.find({
        where: { status: true },
        order: { id: 'DESC' },
      });
    }

    throw new BadRequestException('Invalid type');
  }
}
