import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckEmailDto {
  @IsNotEmpty() // comment: ensures field is not empty
  @IsEmail() // comment: validates email format
  email: string;
}
