// comment: controller handles routes (API endpoints)

import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Delete,
  Query,
  Get,
} from '@nestjs/common';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly service: MasterService) {}

  @Get('get')
  get(@Query('type') type: string) {
    return this.service.get(type);
  }

  @Post('add')
  add(@Body() body: any) {
    // comment: get data from request body
    const { type, name } = body;

    if (!type || !name) {
      throw new BadRequestException('type and name required');
    }

    return this.service.add(type, name);
  }

  @Delete('delete')
  delete(@Query('type') type: string, @Query('id') id: number) {
    return this.service.delete(type, Number(id));
  }
}
