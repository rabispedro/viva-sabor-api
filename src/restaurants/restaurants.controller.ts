import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseBoolPipe,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
// import { CacheInterceptor } from '@nestjs/cache-manager';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRestaurantAddressDto } from './dto/create-restaurant-address.dto';

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

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({ name: 'id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ type: ResponseRestaurantDto })
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: UUID,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10_000_000 }),
          new FileTypeValidator({ fileType: /image\/(png|jpeg|jpg)/g }),
        ],
      }),
    )
    image: Express.Multer.File,
  ): Promise<ResponseRestaurantDto> {
    return await this.restaurantsService.uploadImage(id, image);
  }

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('bannerImage'))
  @ApiParam({ name: 'id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ type: ResponseRestaurantDto })
  async uploadBannerImage(
    @Param('id', ParseUUIDPipe) id: UUID,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10_000_000 }),
          new FileTypeValidator({ fileType: /image\/(png|jpeg|jpg)/g }),
        ],
      }),
    )
    bannerImage: Express.Multer.File,
  ): Promise<ResponseRestaurantDto> {
    return await this.restaurantsService.uploadImage(id, bannerImage);
  }

  @Post(':id/address')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: CreateRestaurantAddressDto })
  @ApiResponse({ type: ResponseRestaurantDto })
  async addAddress(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(ValidationPipe)
    createRestaurantAddressDto: CreateRestaurantAddressDto,
  ): Promise<ResponseRestaurantDto> {
    return await this.restaurantsService.addAddress(
      id,
      createRestaurantAddressDto,
    );
  }
}
