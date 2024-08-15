import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ParseUUIDPipe, Put } from '@nestjs/common';
// import { RolesService } from './roles.service';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
// import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { RolesGuard } from 'src/shared/guards/roles.guard';
// import { Roles } from 'src/shared/decorators/roles.decorator';
// import { UUID } from 'crypto';
// import { RoleResponseDto } from './dto/role-response.dto';
// import { ListResponseDto } from 'src/shared/dtos/list-response.dto';

@Controller('roles')
// @UseGuards(RolesGuard)
// @ApiTags('roles')
// @ApiBearerAuth()
export class RolesController {
  //   constructor(private readonly rolesService: RolesService) { }
  //   // @Post()
  //   // @Roles(['admin'])
  //   // @ApiResponse({ type: RoleResponseDto });
  //   // async create(@Body(ValidationPipe) createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
  //   //   return await this.rolesService.create(createRoleDto);
  //   // }
  //   // @Get()
  //   // @Roles(['admin'])
  //   // @ApiResponse({type: ListResponseDto<RoleResponseDto>})
  //   // async findAll(): Promise<RoleResponseDto[]> {
  //   //   return await this.rolesService.findAll();
  //   // }
  //   // @Get(':id')
  //   // @ApiParam({ name: 'id' })
  //   // @ApiResponse({ type: RoleResponseDto })
  //   // async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<RoleResponseDto> {
  //   //   return await this.rolesService.findOne(id);
  //   // }
  //   @Put(':id')
  //   @ApiParam({ name: 'id' })
  //   @ApiResponse({ type: RoleResponseDto })
  //   update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //     return this.rolesService.update(+id, updateRoleDto);
  //   }
  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.rolesService.remove(+id);
  //   }
}
