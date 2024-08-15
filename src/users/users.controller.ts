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
  // UseInterceptors,
  Put,
  ParseBoolPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { RolesGuard } from 'src/shared/guards/roles.guard';
// import { Roles } from 'src/shared/decorators/roles.decorator';
// import { CacheInterceptor } from '@nestjs/cache-manager';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { PublicRoute } from 'src/shared/decorators/public-route.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';

@Controller('users')
// @UseInterceptors(CacheInterceptor)
@UseGuards(RolesGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @PublicRoute()
  @ApiResponse({ type: UserResponseDto })
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(['admin', 'manager'])
  @ApiResponse({ type: ListResponseDto<UserResponseDto> })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll(true);
  }

  @Get(':id')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: UserResponseDto })
  async findById(
    @Param('id', ParseUUIDPipe) id: UUID,
  ): Promise<UserResponseDto> {
    return await this.usersService.findById(id, true);
  }

  @Put(':id')
  @Roles(['admin', 'manager', 'employee', 'client'])
  @ApiParam({ name: 'id' })
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
  @ApiResponse({ type: UserResponseDto })
  async changeActive(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Param('flag', ParseBoolPipe) flag: boolean,
  ): Promise<UserResponseDto> {
    return await this.usersService.changeActive(id, flag);
  }

  @Delete(':id')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: String })
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<UUID> {
    return await this.usersService.remove(id);
  }
}
