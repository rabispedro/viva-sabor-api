import {
  IsArray,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsArray()
  roles: string[];

  @IsDate()
  birthDate: Date;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;
}
