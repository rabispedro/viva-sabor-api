import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class ResponseAddressDto {
  @ApiProperty()
  id: UUID;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  uf: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  block: string;

  @ApiProperty()
  complement?: string;

  @ApiProperty()
  isActive: boolean;
}
