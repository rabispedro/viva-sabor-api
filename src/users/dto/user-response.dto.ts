import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class UserResponseDto {
  @ApiProperty()
  id: UUID;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  roles: string[];

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  image_url?: string;

  @ApiProperty()
  isActive: boolean;
}
