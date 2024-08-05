import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UUID } from 'crypto';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const result = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(result);
    return { ...result };
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();

    if (!users || users.length === 0)
      throw new NotFoundException('Users cannot be found');

    return { ...users };
  }

  async findById(id: UUID): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User with this id not found');

    return user;
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) throw new NotFoundException('User with this email not found');

    return user;
  }

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<UUID> {
    const user = await this.usersRepository.save(updateUserDto);

    if (!user) throw new BadRequestException('User could not be updated');

    return id;
  }

  async remove(id: UUID): Promise<UUID> {
    const result = (await this.usersRepository.delete(id)).affected;

    if (!result || result === 0) throw new NotFoundException('User not found');

    return id;
  }
}
