import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signupUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signupUser(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  loginUser(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refreshToken(@Body() dto: RefreshTokenDto) {
    if (!dto.refreshToken || typeof dto.refreshToken !== 'string') {
      throw new UnauthorizedException('Missing or invalid refresh token');
    }
    return this.authService.refresh(dto);
  }
}
