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
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { RolesGuard } from 'src/shared/guards/roles.guard';
// import { Roles } from 'src/shared/decorators/roles.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiBearerAuth, ApiResponse, ApiTags, PartialType } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { Type } from 'class-transformer';

@Controller('users')
@UseInterceptors(CacheInterceptor)
@UseGuards(RolesGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @Roles(['admin', 'manager'])
  @ApiResponse({type: UserResponseDto})
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  // @ApiResponse({ type: Array<UserResponseDto> })
  @ApiResponse({ type: UserResponseDto.prototype })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: UserResponseDto})
  async findOne(
    @Param('id', ParseUUIDPipe) id: UUID,
  ): Promise<UserResponseDto> {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  // @Roles(['admin', 'manager'])
  @ApiResponse({ type: typeof string })
  update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<UUID> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Roles(['admin', 'manager'])
  @ApiResponse({type: typeof string})
  remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return this.usersService.remove(id);
  }
}
