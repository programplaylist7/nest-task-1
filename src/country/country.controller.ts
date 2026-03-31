import { Controller, Post, Body } from '@nestjs/common';
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
}
