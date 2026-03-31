import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Country } from './country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepo: Repository<Country>,
  ) {}

  // comment: create country
  async create(data: { name: string }) {
    // comment: check duplicate
    const exist = await this.countryRepo.findOne({
      where: { name: data.name },
    });

    if (exist) {
      throw new BadRequestException('Country already exists');
    }

    // comment: create country
    const country = this.countryRepo.create({
      name: data.name,
      status: true, // comment: active
    });

    return this.countryRepo.save(country);
  }
}
