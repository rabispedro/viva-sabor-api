import { Role } from 'src/roles/entities/role.entity';
import { ResponseUserDto } from '../dto/response-user.dto';
import { User } from '../entities/user.entity';

export class UsersMapper {
  static map(user: User): ResponseUserDto {
    return {
      ...user,
      roles: user.roles?.map((role: Role) => role.name),
    };
  }
}
