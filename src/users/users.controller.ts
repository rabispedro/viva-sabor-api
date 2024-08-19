import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Put,
  ParseBoolPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UUID } from 'crypto';
import { PublicRoute } from 'src/shared/decorators/public-route.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';

@Controller('users')
// @UseInterceptors(CacheInterceptor)
@UseGuards(RolesGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @PublicRoute()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: ResponseUserDto })
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(['admin', 'manager'])
  @ApiResponse({ type: ListResponseDto<ResponseUserDto> })
  async findAll(): Promise<ListResponseDto<ResponseUserDto>> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: ResponseUserDto })
  async findOneById(
    @Param('id', ParseUUIDPipe) id: UUID,
  ): Promise<ResponseUserDto> {
    return await this.usersService.findOneById(id, true);
  }

  @Put(':id')
  @Roles(['admin', 'manager', 'employee', 'client'])
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UUID> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/active/:flag')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'flag' })
  @ApiResponse({ type: ResponseUserDto })
  async changeActive(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Param('flag', ParseBoolPipe) flag: boolean,
  ): Promise<ResponseUserDto> {
    return await this.usersService.changeActive(id, flag);
  }

  @Delete(':id')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: String })
  async softDelete(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.usersService.softDelete(id);
  }

  @Patch(':id/restore')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: String })
  async restore(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.usersService.restore(id);
  }

  @Patch(':id/change-password')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: ChangePasswordUserDto })
  @ApiResponse({ type: Boolean })
  async changePassword(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() changePasswordUserDto: ChangePasswordUserDto,
  ): Promise<boolean> {
    return await this.usersService.changePassword(id, changePasswordUserDto);
  }

  @Post(':id/upload-profile-image')
  @UseInterceptors(FileInterceptor('profileImage'))
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
  @ApiResponse({ type: ResponseUserDto })
  async uploadProfileImage(
    @Param('id', ParseUUIDPipe) id: UUID,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10_000_000 }),
          new FileTypeValidator({ fileType: /image\/(png|jpeg|jpg)/g }),
        ],
      }),
    )
    profileImage: Express.Multer.File,
  ): Promise<ResponseUserDto> {
    return await this.usersService.uploadProfileImage(id, profileImage);
  }

  @Post(':id/address')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: CreateUserAddressDto })
  @ApiResponse({ type: ResponseUserDto })
  async createToUser(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(ValidationPipe) createAddressDto: CreateUserAddressDto,
  ): Promise<ResponseUserDto> {
    return await this.usersService.addAddress(id, createAddressDto);
  }
}
