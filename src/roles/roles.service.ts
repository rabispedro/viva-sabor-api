import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { ILike, Repository } from 'typeorm';
import { ResponseRoleDto } from './dto/response-role.dto';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { RolesMapper } from './mappers/roles.mapper';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<ResponseRoleDto> {
    const role: Role = this.rolesRepository.create(createRoleDto);
    await this.rolesRepository.save(role);

    return RolesMapper.map(role);
  }

  async findAll(): Promise<ListResponseDto<ResponseRoleDto>> {
    const roles: Role[] = await this.rolesRepository.find({
      cache: true,
    });

    if (!roles || roles.length === 0)
      throw new NotFoundException('Roles could not be found');

    const response: ResponseRoleDto[] = roles.map((role: Role) =>
      RolesMapper.map(role),
    );

    return new ListResponseDto<ResponseRoleDto>([...response], 100, 0, 10);
  }

  async findAllByName(name: string): Promise<ListResponseDto<ResponseRoleDto>> {
    const roles: Role[] = await this.rolesRepository.find({
      where: {
        name: ILike(name),
      },
      cache: true,
    });

    if (!roles || roles.length === 0)
      throw new NotFoundException('Roles could not be found');

    const response: ResponseRoleDto[] = roles.map((role: Role) =>
      RolesMapper.map(role),
    );

    return new ListResponseDto<ResponseRoleDto>([...response], 100, 0, 10);
  }
}
