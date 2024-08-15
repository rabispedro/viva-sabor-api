import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class RoleResponseDto {
  @ApiProperty()
  id: UUID;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
