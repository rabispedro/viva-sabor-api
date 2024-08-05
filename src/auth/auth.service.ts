import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async singIn(authLoginDto: AuthLoginDto): Promise<AuthTokenResponseDto> {
    const user = await this.usersService.findByEmail(authLoginDto.email);

    if (!user || !user.password)
      throw new UnauthorizedException('User not authorized');

    // const passwordMatch: boolean = await compare(
    //   authLoginDto.password,
    //   user.password,
    // );

    // if (!passwordMatch) throw new UnauthorizedException('Wrong credentials');

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.email,
    });

    return {
      accessToken: token,
    };
  }
}
