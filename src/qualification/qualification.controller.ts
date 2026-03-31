import { Controller, Get } from '@nestjs/common';
import { QualificationService } from './qualification.service';

@Controller('qualification')
export class QualificationController {
  constructor(private readonly service: QualificationService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
