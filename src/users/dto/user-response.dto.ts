import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { Role } from '../entities/roles.entity';

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
  roles: Role[];

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
