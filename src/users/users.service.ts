import {
  BadRequestException,
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
// import * as Minio from 'minio';
// import { TypedClient } from 'minio/dist/main/internal/client';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // private readonly minioRepository: TypedClient,
  ) {
    // this.minioRepository = new Minio.Client({
    //   endPoint: process.env.BUCKET_HOST!,
    //   port: Number(process.env.BUCKET_PORT!),
    //   useSSL: false,
    //   accessKey: process.env.BUCKET_ACCESS_KEY!,
    //   secretKey: process.env.BUCKET_SECRET_KEY!,
    // });
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    createUserDto.password = hashSync(
      createUserDto.password,
      process.env.ENCRYPT_SALT!,
    );

    const user: User = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    user.password = '';
    return UsersMapper.map(user);
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
      UsersMapper.map(user),
    );

    return new ListResponseDto<ResponseUserDto>([...response], 100, 0, 10);
  }

  async findById(id: UUID, ommitPassword?: boolean): Promise<ResponseUserDto> {
    const user: User | null = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        roles: true,
      },
      cache: true,
    });

    if (!user)
      throw new NotFoundException('User with this id could not be found');

    if (ommitPassword === true) user.password = '';

    return UsersMapper.map(user);
  }

  async findByEmail(
    email: string,
    ommitPassword?: boolean,
  ): Promise<ResponseUserDto> {
    const user: User | null = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        roles: true,
      },
      cache: true,
    });

    if (!user)
      throw new NotFoundException('User with this email could not be found');

    if (ommitPassword === true) user.password = '';

    return UsersMapper.map(user);
  }

  async changeActive(id: UUID, flag: boolean): Promise<ResponseUserDto> {
    let user: User | null = await this.usersRepository.findOneBy({ id: id });

    if (!user)
      throw new NotFoundException('User with this id could not be found');

    user = await this.usersRepository.save({ ...user, isActive: flag });

    return UsersMapper.map(user);
  }

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<UUID> {
    const user: User = await this.usersRepository.save(updateUserDto);

    if (!user) throw new BadRequestException('User could not be updated');

    return id;
  }

  async remove(id: UUID): Promise<UUID> {
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
    profileImageUrl: Express.Multer.File,
  ): Promise<ResponseUserDto> {
    let user: User | null = await this.usersRepository.findOneBy({ id: id });

    if (!user)
      throw new NotFoundException('User could not update profile photo');

    const profileImageName = `${id}-${new Date().toISOString()}.${profileImageUrl.mimetype.replace('image/', '')}`;

    // await this.minioRepository.putObject(
    //   'users',
    //   profileImageName,
    //   profileImageUrl.buffer,
    // );

    console.info('[USER]:', user);
    console.info('[profileImageName]:', profileImageName);
    user = await this.usersRepository.save({
      ...user,
      profileImageUrl: profileImageName,
    });
    user.password = '';

    return UsersMapper.map(user);
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

  // private setupBucket(): Promise<Void> {
  // const userBucketExists = await this.minioRepository.bucketExists('users');
  // if (!userBucketExists) await this.minioRepository.makeBucket('users');
  // return;
  // }
}
