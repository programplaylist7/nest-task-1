// comment: module connects controller + service + database

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MasterController } from './master.controller';
import { MasterService } from './master.service';

import { Qualification } from '../qualification/qualification.entity';
import { Designation } from '../designation/designation.entity';
import { Country } from '../country/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Qualification, Designation, Country]), // comment: inject repositories
  ],
  controllers: [MasterController],
  providers: [MasterService],
})
export class MasterModule {}
