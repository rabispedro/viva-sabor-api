import { Role } from 'src/roles/entities/role.entity';
import { ResponseUserDto } from '../dto/response-user.dto';
import { User } from '../entities/user.entity';

export abstract class UsersMapper {
  static mapToDto(user: User): ResponseUserDto {
    return {
      ...user,
      roles: user.roles?.map((role: Role) => role.name),
    } as unknown as ResponseUserDto;
  }

  static mapToEntity(user: ResponseUserDto): User {
    return {
      ...user,
    } as unknown as User;
  }
}
