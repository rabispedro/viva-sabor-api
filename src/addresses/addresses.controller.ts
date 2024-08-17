import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  ParseUUIDPipe,
  Put,
  Patch,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UUID } from 'crypto';
import { ResponseAddressDto } from './dto/response-address.dto';

@Controller('addresses')
@ApiTags('addresses')
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post('user/:userId')
  @ApiParam({ name: 'userId' })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ type: ResponseAddressDto })
  async createToUser(
    @Param('userId', ParseUUIDPipe) userId: UUID,
    @Body(ValidationPipe) createAddressDto: CreateAddressDto,
  ): Promise<ResponseAddressDto> {
    return await this.addressesService.createtoUser(userId, createAddressDto);
  }

  @Post('restaurant/:restaurantId')
  @ApiParam({ name: 'restaurantId' })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ type: ResponseAddressDto })
  async createToRestaurant(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: UUID,
    @Body(ValidationPipe) createAddressDto: CreateAddressDto,
  ): Promise<ResponseAddressDto> {
    return await this.addressesService.createToRestaurant(
      restaurantId,
      createAddressDto,
    );
  }

  @Get('user/:userId')
  @ApiParam({ name: 'userId' })
  @ApiResponse({ type: ListResponseDto<ResponseAddressDto> })
  async findAllByUserId(
    @Param('userId', ParseUUIDPipe) userId: UUID,
  ): Promise<ListResponseDto<ResponseAddressDto>> {
    return await this.addressesService.findAllByUserId(userId);
  }

  @Get('restaurant/:restaurantId')
  @ApiParam({ name: 'restaurantId' })
  @ApiResponse({ type: ListResponseDto<ResponseAddressDto> })
  async findAllByRestaurantId(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: UUID,
  ): Promise<ListResponseDto<ResponseAddressDto>> {
    return await this.addressesService.findAllByRestaurantId(restaurantId);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ type: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(ValidationPipe) updateAddressDto: UpdateAddressDto,
  ): Promise<UUID> {
    return await this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: 'uuid' })
  async softDelete(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.addressesService.softDelete(id);
  }

  @Patch(':id/restore')
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: 'uuid' })
  async restore(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.addressesService.restore(id);
  }
}
