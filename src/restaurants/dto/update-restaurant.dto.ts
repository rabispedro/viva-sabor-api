import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsEmail, IsNumber, IsNumberString, IsString } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiProperty()
  @IsString()
  razaoSocial: string;

  @ApiProperty()
  @IsString()
  nomeFantasia: string;

  @ApiProperty()
  @IsNumberString()
  cnpj: string;

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  bannerImageUrl?: string;

  @ApiProperty()
  @IsNumber()
  minimumFee: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumberString()
  phoneNumber: string;
}
