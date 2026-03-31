import { Controller, Post, Body, Get } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly service: CountryService) {}

  // comment: create country API
  @Post()
  create(@Body() body: CreateCountryDto) {
    return this.service.create(body);
  }

  @Get()
  async getAllCountries() {
    return this.service.findAll();
  }
}
