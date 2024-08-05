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
    console.log('Teste: ', createUserDto);

    const user: UserResponseDto = {
      ...createUserDto,
      id: crypto.randomUUID(),
      isActive: true,
    };

    return this.usersRepository.create(user);
  }

  findAll(
    activeOnly?: boolean,
    quantity?: number,
    page?: number,
  ): UserResponseDto[] {
    const users = this.usersRepository.findAll(activeOnly, quantity, page);

    if (!users || users.length === 0)
      throw new NotFoundException('Users cannot be found');

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

  remove(id: UUID): boolean {
    return this.usersRepository.remove(id);
  }
}
