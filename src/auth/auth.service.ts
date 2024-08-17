import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(authLoginDto: AuthLoginDto): Promise<AuthTokenResponseDto> {
    const user: ResponseUserDto = await this.usersService.findOneByEmail(
      authLoginDto.email,
    );

    if (!user || !user.password)
      throw new UnauthorizedException('User not authorized');

    const passwordMatch: boolean = await compare(
      authLoginDto.password,
      user.password,
    );

    if (!passwordMatch) throw new UnauthorizedException('Wrong credentials');

    const token: string = await this.jwtService.signAsync({
      sub: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      profileImage: user.profileImageUrl ?? '',
      roles: user.roles,
      restaurant: null ?? '',
    });

    return {
      accessToken: token,
    };
  }
}
