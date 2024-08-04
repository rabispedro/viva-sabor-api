import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
