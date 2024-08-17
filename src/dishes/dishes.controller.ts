import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { UUID } from 'crypto';
import { ResponseDishDto } from './dto/response-dish.dto';

@Controller('dishes')
@UseGuards(RolesGuard)
@ApiTags('dishes')
@ApiBearerAuth()
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  @Roles(['admin', 'manager', 'employee'])
  @ApiBody({ type: CreateDishDto })
  @ApiResponse({ type: ResponseDishDto })
  async create(
    @Body(ValidationPipe) createDishDto: CreateDishDto,
  ): Promise<ResponseDishDto> {
    return await this.dishesService.create(createDishDto);
  }

  @Get('restaurant/:restaurantId')
  @Roles(['admin', 'manager', 'employee'])
  @ApiParam({ name: 'restaurantId' })
  @ApiResponse({ type: ListResponseDto<ResponseDishDto> })
  async findAllByRestaurant(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: UUID,
  ): Promise<ListResponseDto<ResponseDishDto>> {
    return await this.dishesService.findAllByRestaurant(restaurantId);
  }

  @Get(':query')
  @Roles(['admin', 'manager', 'employee'])
  @ApiParam({ name: 'query' })
  @ApiResponse({ type: ListResponseDto<ResponseDishDto> })
  async findAllByNameOrDescription(
    @Param('query') query: string,
  ): Promise<ListResponseDto<ResponseDishDto>> {
    return await this.dishesService.findAllByNameOrDescription(query);
  }

  @Put(':id')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateDishDto })
  @ApiResponse({ type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(ValidationPipe) updateDishDto: UpdateDishDto,
  ): Promise<UUID> {
    return await this.dishesService.update(id, updateDishDto);
  }

  @Delete(':id')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: String })
  async softDelete(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.dishesService.softDelete(id);
  }

  @Patch(':id/restore')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: String })
  async restore(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.dishesService.restore(id);
  }
}
