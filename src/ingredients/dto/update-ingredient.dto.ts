import { PartialType } from '@nestjs/swagger';
import { CreateIngredientDto } from './create-ingredient.dto';
import { IsString } from 'class-validator';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {
  @IsString()
  name: string;
}
