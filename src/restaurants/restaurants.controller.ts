import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ParseUUIDPipe,
  Put,
  ParseBoolPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { UUID } from 'crypto';
import { RestaurantResponseDto } from './dto/restaurant-response.dto';

@Controller('restaurants')
@UseInterceptors(CacheInterceptor)
@UseGuards(RolesGuard)
@ApiTags('restaurants')
@ApiBearerAuth()
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // @Post()
  // // @Roles(['admin', 'manager'])
  // @Roles(['admin', 'manager'])
  // // @ApiResponse()
  // async create(
  //   @Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto,
  // ): Promise<RestaurantResponseDto> {
  //   return await this.restaurantsService.create(createRestaurantDto);
  // }

  // @Get()
  // // @ApiResponse()
  // async findAll(): Promise<RestaurantResponseDto[]> {
  //   return await this.restaurantsService.findAll();
  // }

  // @Get(':id')
  // @ApiParam({ name: 'id' })
  // // @ApiResponse({ type: RestaurantResponseDto })
  // async findById(
  //   @Param('id', ParseUUIDPipe) id: UUID,
  // ): Promise<RestaurantResponseDto> {
  //   return await this.restaurantsService.findById(id);
  // }

  // @Put(':id')
  // @ApiParam({ name: 'id' })
  // async update(
  //   @Param('id', ParseUUIDPipe) id: UUID,
  //   @Body(ValidationPipe) updateRestaurantDto: UpdateRestaurantDto,
  // ): Promise<UUID> {
  //   return await this.restaurantsService.update(id, updateRestaurantDto);
  // }

  // @Patch(':id/active/:flag')
  // // @Roles(['admin', 'manager'])
  // @ApiParam({ name: 'id' })
  // @ApiParam({ name: 'flag' })
  // // @ApiResponse()
  // async changeActive(
  //   @Param('id', ParseUUIDPipe) id: UUID,
  //   @Param('flag', ParseBoolPipe) flag: boolean,
  // ): Promise<RestaurantResponseDto> {
  //   return await this.restaurantsService.changeActive(id, flag);
  // }

  // @Delete(':id')
  // // @Roles(['admin', 'manager'])
  // @ApiParam({ name: 'id' })
  // // @ApiResponse()
  // async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
  //   return await this.restaurantsService.remove(id);
  // }
}
