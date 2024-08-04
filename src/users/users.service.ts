import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UUID } from 'crypto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto): UUID {
    const user: User = {
      ...createUserDto,
      id: crypto.randomUUID(),
    };

    return this.usersRepository.create(user);
  }

  findAll(): User[] {
    const users = this.usersRepository.findAll();

    if (!users || users.length === 0) throw new NotFoundException();

    return users;
  }

  findOne(id: UUID): User | undefined {
    return this.usersRepository.findOne(id);
  }

  update(id: UUID, updateUserDto: UpdateUserDto) {
    const user: User = {
      ...updateUserDto,
      id: crypto.randomUUID(),
    };

    return this.usersRepository.update(id, user);
  }

  remove(id: UUID) {
    return `This action removes a #${id} user`;
  }
}
