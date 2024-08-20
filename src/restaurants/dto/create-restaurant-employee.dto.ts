import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateRestaurantEmployeeDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsDateString()
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
  profileImageUrl?: string;
}
