import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/roles.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsArray()
  roles: Role[];

  @ApiProperty()
  @IsDate()
  birthDate: Date;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
