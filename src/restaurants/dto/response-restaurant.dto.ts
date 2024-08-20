import { ApiProperty } from '@nestjs/swagger';
import { ResponseAddressDto } from 'src/addresses/dto/response-address.dto';
import { ResponseDishDto } from 'src/dishes/dto/response-dish.dto';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';

export class ResponseRestaurantDto {
  @ApiProperty()
  razaoSocial: string;

  @ApiProperty()
  nomeFantasia: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  bannerImageUrl?: string;

  @ApiProperty()
  minimumFee: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  employees: ResponseUserDto[];

  @ApiProperty()
  dishes: ResponseDishDto[];

  @ApiProperty()
  addresses: ResponseAddressDto[];
}
