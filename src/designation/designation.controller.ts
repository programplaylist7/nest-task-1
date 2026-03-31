import { Controller, Get } from '@nestjs/common';
import { DesignationService } from './designation.service';

@Controller('designation')
export class DesignationController {
  constructor(private readonly service: DesignationService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
