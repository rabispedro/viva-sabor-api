import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ResponseRoleDto } from './dto/response-role.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';

@Controller('roles')
@UseGuards(RolesGuard)
@ApiTags('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(['admin'])
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ type: ResponseRoleDto })
  async create(
    @Body(ValidationPipe) createRoleDto: CreateRoleDto,
  ): Promise<ResponseRoleDto> {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  @Roles(['admin', 'manager'])
  @ApiResponse({ type: ListResponseDto<ResponseRoleDto> })
  async findAll(): Promise<ListResponseDto<ResponseRoleDto>> {
    return await this.rolesService.findAll();
  }

  @Get('name/:name')
  @Roles(['admin', 'manager'])
  @ApiParam({ name: 'name' })
  @ApiResponse({ type: ListResponseDto<ResponseRoleDto> })
  async findAllByName(
    @Param('name') name: string,
  ): Promise<ListResponseDto<ResponseRoleDto>> {
    return await this.rolesService.findAllByName(name);
  }
}
