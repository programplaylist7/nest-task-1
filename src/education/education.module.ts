import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './education.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Education]), // comment: register entity
  ],
})
export class EducationModule {}
