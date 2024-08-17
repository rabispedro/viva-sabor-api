import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UUID } from 'crypto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hashSync } from 'bcrypt';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { UsersMapper } from './mappers/users.mapper';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { FileUtils } from 'src/shared/utils/file.utils';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { BucketUtils } from 'src/shared/utils/bucket.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(MINIO_CONNECTION)
    private readonly usersBucket: Client,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    createUserDto.password = hashSync(
      createUserDto.password,
      process.env.ENCRYPT_SALT!,
    );

    const user: User = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    user.password = '';
    return UsersMapper.mapToDto(user);
  }

  async findAll(): Promise<ListResponseDto<ResponseUserDto>> {
    const users: User[] = await this.usersRepository.find({
      relations: {
        roles: true,
      },
      cache: true,
      // skip: 1,
    });

    if (!users || users.length === 0)
      throw new NotFoundException('Users could not be found');

    users.forEach((user: User) => (user.password = ''));

    const response: ResponseUserDto[] = users.map((user: User) =>
      UsersMapper.mapToDto(user),
    );

    return new ListResponseDto<ResponseUserDto>([...response], 100, 0, 10);
  }

  async findOneById(
    id: UUID,
    ommitPassword?: boolean,
  ): Promise<ResponseUserDto> {
    const user: User | null = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        addresses: true,
        restaurant: true,
        roles: true,
      },
      cache: true,
    });

    if (!user)
      throw new NotFoundException('User with this id could not be found');

    if (ommitPassword === true) user.password = '';

    return UsersMapper.mapToDto(user);
  }

  async findOneByEmail(
    email: string,
    ommitPassword?: boolean,
  ): Promise<ResponseUserDto> {
    const user: User | null = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        addresses: true,
        restaurant: true,
        roles: true,
      },
      cache: true,
    });

    if (!user)
      throw new NotFoundException('User with this email could not be found');

    if (ommitPassword === true) user.password = '';

    return UsersMapper.mapToDto(user);
  }

  async changeActive(id: UUID, flag: boolean): Promise<ResponseUserDto> {
    let user: User | null = await this.usersRepository.findOneBy({ id: id });

    if (!user)
      throw new NotFoundException('User with this id could not be found');

    user = await this.usersRepository.save({ ...user, isActive: flag });

    return UsersMapper.mapToDto(user);
  }

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<UUID> {
    const user: User = await this.usersRepository.save(updateUserDto);

    if (!user) throw new BadRequestException('User could not be updated');

    return id;
  }

  async softDelete(id: UUID): Promise<UUID> {
    const result: number | null | undefined = (
      await this.usersRepository.softDelete({
        id: id,
      })
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('User could not be deleted');

    return id;
  }

  async restore(id: UUID): Promise<UUID> {
    const result = (
      await this.usersRepository.restore({
        id: id,
      })
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('User could not be restored');

    return id;
  }

  async uploadProfileImage(
    id: UUID,
    profileImageFile: Express.Multer.File,
  ): Promise<ResponseUserDto> {
    let user: User | null = await this.usersRepository.findOneBy({ id: id });

    if (!user)
      throw new NotFoundException('User could not update profile photo');

    const profileImageId: UUID = crypto.randomUUID();
    const profileImageType: string = FileUtils.extractFileTypeFromMime(
      profileImageFile.mimetype,
    );
    const profileImageName: string = `${profileImageId}.${profileImageType}`;

    await BucketUtils.setupBucket(this.usersBucket, 'users');
    await this.usersBucket.putObject(
      'users',
      profileImageName,
      profileImageFile.buffer,
    );

    const profileImagePath: string = `${process.env.BUCKET_HOST!}:${process.env.BUCKET_PORT!}/users/${profileImageName}`;

    user = await this.usersRepository.save({
      ...user,
      profileImageUrl: profileImagePath,
    });
    user.password = '';

    return UsersMapper.mapToDto(user);
  }

  async changePassword(
    id: UUID,
    changePasswordUserDto: ChangePasswordUserDto,
  ): Promise<boolean> {
    const user: User | null = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user || !user.password)
      throw new NotFoundException('User with this id could not be found');

    const passwordMatch: boolean = await compare(
      changePasswordUserDto.oldPassword,
      user.password,
    );

    if (!passwordMatch) throw new UnauthorizedException('Wrong credentials');

    const newPassword: string = hashSync(
      changePasswordUserDto.newPassword,
      process.env.ENCRYPT_SALT!,
    );

    user.password = newPassword;
    await this.usersRepository.save(user);

    return true;
  }
}
