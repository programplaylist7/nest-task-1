import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/user.entity';
import { UserDetails } from 'src/user-details/user-details.entity';
import { Country } from 'src/country/country.entity';
import { WorkExperience } from 'src/work-experience/work-experience.entity';
import { Education } from 'src/education/education.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { StringValue } from 'ms';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserDetails,
      Country,
      Education,
      WorkExperience,
    ]), // comment: we need user table access

    JwtModule.registerAsync({
      imports: [ConfigModule], // comment: import config
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // comment: safe access
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    EmailModule, // comment: import email module
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
