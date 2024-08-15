import { Role } from 'src/roles/entities/role.entity';
import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../entities/user.entity';

export class UsersMapper {
  static map(user: User): UserResponseDto {
    return {
      ...user,
      roles: user.roles?.map((role: Role) => role.name),
    };
  }
}
