import { ResponseRoleDto } from '../dto/response-role.dto';
import { Role } from '../entities/role.entity';

export class RolesMapper {
  static map(role: Role): ResponseRoleDto {
    return { ...role };
  }
}
