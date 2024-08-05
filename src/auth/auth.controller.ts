import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async create(
    @Body(ValidationPipe) authLoginDto: AuthLoginDto,
  ): Promise<AuthTokenResponseDto> {
    return await this.authService.singIn(authLoginDto);
  }
}
