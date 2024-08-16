import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNumberString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  uf: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  @IsNumberString()
  number: string;

  @ApiProperty()
  @IsString()
  block: string;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  complement?: string;
}
