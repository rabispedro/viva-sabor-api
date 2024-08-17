import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
// import { CacheInterceptor } from '@nestjs/cache-manager';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ResponseRestaurantDto } from './dto/response-restaurant.dto';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { UUID } from 'crypto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurants')
// @UseInterceptors(CacheInterceptor)
@UseGuards(RolesGuard)
@ApiTags('restaurants')
@ApiBearerAuth()
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(['admin'])
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({ type: ResponseRestaurantDto })
  async create(
    @Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto,
  ): Promise<ResponseRestaurantDto> {
    return await this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @ApiResponse({ type: ListResponseDto<ResponseRestaurantDto> })
  async findAll(): Promise<ListResponseDto<ResponseRestaurantDto>> {
    return await this.restaurantsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: ResponseRestaurantDto })
  async findOneById(
    @Param('id', ParseUUIDPipe) id: UUID,
  ): Promise<ResponseRestaurantDto> {
    return await this.restaurantsService.findOneById(id);
  }

  @Get('name/:name')
  @ApiParam({ name: 'name' })
  @ApiResponse({ type: ListResponseDto<ResponseRestaurantDto> })
  async findAllByName(
    @Param('name', ParseUUIDPipe) id: UUID,
  ): Promise<ListResponseDto<ResponseRestaurantDto>> {
    return await this.restaurantsService.findAllByName(id);
  }

  @Put(':id')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(ValidationPipe) updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<UUID> {
    return await this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Patch(':id/active/:flag')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'flag' })
  @ApiResponse({ type: ResponseRestaurantDto })
  async changeActive(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Param('flag', ParseBoolPipe) flag: boolean,
  ): Promise<ResponseRestaurantDto> {
    return await this.restaurantsService.changeActive(id, flag);
  }

  @Delete(':id')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: String })
  async softDelete(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.restaurantsService.softDelete(id);
  }

  @Patch(':id/restore')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: String })
  async restore(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.restaurantsService.restore(id);
  }
}
