import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
@UseGuards(RolesGuard)
@ApiTags('ingredients')
@ApiBearerAuth()
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}
}
