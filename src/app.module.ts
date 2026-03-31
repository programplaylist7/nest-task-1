import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DesignationModule } from './designation/designation.module';
import { QualificationModule } from './qualification/qualification.module';
import { CountryModule } from './country/country.module';
import { UserDetailsModule } from './user-details/user-details.module';
import { EducationModule } from './education/education.module';
import { WorkExperienceModule } from './work-experience/work-experience.module';
import { AuthModule } from './auth/auth.module';
import { MasterModule } from './master/master.module';

@Module({
  imports: [
    // comment: enable env file
    ConfigModule.forRoot({ isGlobal: true }),

    // comment: connect to PostgreSQL (Neon)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,

      autoLoadEntities: true,
      synchronize: true,

      ssl: true, // ✅ IMPORTANT change

      extra: {
        ssl: {
          rejectUnauthorized: false, // ✅ still needed
        },
      },

      retryAttempts: 3,
      retryDelay: 2000,
    }),

    CountryModule,
    UserModule,
    DesignationModule,
    QualificationModule,
    UserDetailsModule,
    EducationModule,
    WorkExperienceModule,
    AuthModule,
    MasterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
