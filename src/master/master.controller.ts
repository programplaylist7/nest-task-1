// comment: controller handles routes (API endpoints)

import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly service: MasterService) {}

  @Post('add')
  add(@Body() body: any) {
    // comment: get data from request body
    const { type , name } = body;

    if (!type || !name) {
      throw new BadRequestException('type and name required');
    }

    return this.service.add(type, name);
  }
}
