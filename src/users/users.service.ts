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
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    createUserDto.password = hashSync(
      createUserDto.password,
      process.env.ENCRYPT_SALT!,
    );

    const result = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(result);

    return { ...result, password: '' };
  }

  async findAll(ommitPassword?: boolean): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();

    if (!users || users.length === 0)
      throw new NotFoundException('Users cannot be found');

    if (ommitPassword === true)
      users.forEach((user: User) => (user.password = ''));

    console.log('Users: ', users);

    return [];
  }

  async findById(id: UUID, ommitPassword?: boolean): Promise<UserResponseDto> {
    const user: User | null = await this.usersRepository.findOneBy({ id: id });

    if (!user) throw new NotFoundException('User with this id not found');

    if (ommitPassword === true) user.password = '';

    return { ...user, roles: [] };
  }

  async findByEmail(
    email: string,
    ommitPassword?: boolean,
  ): Promise<UserResponseDto> {
    const user: User | null = await this.usersRepository.findOneBy({
      email: email,
    });

    if (!user) throw new NotFoundException('User with this email not found');

    if (ommitPassword === true) user.password = '';

    return { ...user, roles: [] };
  }

  async changeActive(id: UUID, flag: boolean): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id: id });
    await this.usersRepository.save({ ...user, isActive: flag });

    return { ...user, id: id } as UserResponseDto;
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
