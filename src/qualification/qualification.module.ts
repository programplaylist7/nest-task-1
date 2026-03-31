import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qualification } from './qualification.entity';
import { QualificationService } from './qualification.service';
import { QualificationController } from './qualification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Qualification]), // comment: connect qualification entity
  ],
  controllers: [QualificationController],
  providers: [QualificationService],
})
export class QualificationModule {}
