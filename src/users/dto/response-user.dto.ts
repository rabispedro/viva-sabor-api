import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { ResponseAddressDto } from 'src/addresses/dto/response-address.dto';

export class ResponseUserDto {
  @ApiProperty()
  id: UUID;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  roles: string[];

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  profileImageUrl?: string;

  @ApiProperty()
  addresses: ResponseAddressDto[];
}
