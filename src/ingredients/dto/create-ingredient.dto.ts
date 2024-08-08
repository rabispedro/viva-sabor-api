import { IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateIngredientDto {
  @IsUUID()
  id: UUID;

  @IsString()
  name: string;

  @IsUUID()
  item: UUID;
}
