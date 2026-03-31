import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { UserDetails } from './user-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDetails]), // comment: register entity
  ],
  providers: [UserDetailsService],
  controllers: [UserDetailsController],
})
export class UserDetailsModule {}
