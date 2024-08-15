import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsUUID()
  @IsNotEmpty()
  id: UUID;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
