import { IsNotEmpty, IsNumber, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// comment: education item
export class EducationItemDto {
  @Type(() => Number)
  @IsNumber()
  qualification_id: number;

  @IsString()
  specialization: string;
}

// comment: experience item
export class ExperienceItemDto {
  @IsString()
  organization_name: string;

  @Type(() => Number)
  @IsNumber()
  designation_id: number;

  @Type(() => Number)
  @IsNumber()
  from_year: number;

  @Type(() => Number)
  @IsNumber()
  to_year: number;

  @IsString()
  job_profile: string;

  @Type(() => Boolean)
  @IsBoolean()
  is_current: boolean;
}

// comment: main dto
export class SignupStep2Dto {
  @Type(() => Number)
  @IsNumber()
  user_id: number;

  // comment: still string because coming from form-data
  @IsNotEmpty()
  education: string;

  @IsNotEmpty()
  experience: string;
}
