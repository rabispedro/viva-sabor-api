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
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { PublicRoute } from 'src/shared/decorators/public-route.decorator';

@Controller('users')
@UseInterceptors(CacheInterceptor)
@UseGuards(RolesGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @Roles(['admin', 'manager'])
  @PublicRoute()
  @ApiResponse({ type: UserResponseDto })
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  // @ApiResponse({ type: Array<UserResponseDto> })
  @ApiResponse({ type: UserResponseDto })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll(true);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: UserResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: UUID,
  ): Promise<UserResponseDto> {
    return await this.usersService.findById(id, true);
  }

  @Patch(':id')
  // @Roles(['admin', 'manager'])
  // @ApiResponse({ type: typeof string })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<UUID> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Roles(['admin', 'manager'])
  // @ApiResponse({ type: typeof string })
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.usersService.remove(id);
  }
}
