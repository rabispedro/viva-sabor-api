import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UUID } from 'crypto';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto): UUID {
    const user: UserResponseDto = {
      ...createUserDto,
      id: crypto.randomUUID(),
    };

    return this.usersRepository.create(user);
  }

  findAll(
    activeOnly?: boolean,
    quantity?: number,
    page?: number,
  ): UserResponseDto[] {
    const users = this.usersRepository.findAll(activeOnly, quantity, page);

    if (!users || users.length === 0) throw new NotFoundException();

    return users;
  }

  findOne(id: UUID): UserResponseDto | undefined {
    return this.usersRepository.findOne(id);
  }

  update(id: UUID, updateUserDto: UpdateUserDto): boolean {
    const user: User = {
      ...updateUserDto,
      id: crypto.randomUUID(),
    };

    return this.usersRepository.update(id, user);
  }

  remove(_id: UUID): boolean {
    return false;
  }
}
