import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signupUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { RefreshTokenBody } from './auth.interfaces';
import { ErorrMessagesEnum, RoutingPathsEnum } from 'src/constants';

@Controller(RoutingPathsEnum.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(RoutingPathsEnum.SIGNUP)
  async signupUser(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(RoutingPathsEnum.LOGIN)
  loginUser(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(RoutingPathsEnum.REFRESH)
  refreshToken(@Body() body: RefreshTokenBody) {
    const token = body?.refreshToken;

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException(ErorrMessagesEnum.INVALID_REFRESH_TOKEN);
    }
    return this.authService.refresh(body);
  }
}
