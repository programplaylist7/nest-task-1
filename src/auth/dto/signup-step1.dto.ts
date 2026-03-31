import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class SignupStep1Dto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  full_name: string;

  @IsDateString()
  dob: string;

  @IsNotEmpty()
  country_id: number;

  @IsOptional()
  state: string;

  @IsOptional()
  city: string;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  mobile_number: string;

  @IsNotEmpty()
  total_experience: string;

  @IsNotEmpty()
  key_skills: string;
}
