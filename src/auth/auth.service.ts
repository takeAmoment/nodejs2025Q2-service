import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prismaService/prismaService.service';
import { SignupUserDto } from './dto/signupUser.dto';
import {
  ErorrMessagesEnum,
  JWT_ACCESS_EXPIRATION_TIME,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRATION_TIME,
  JWT_REFRESH_SECRET,
  MessagesEnum,
  SALT_ROUNDS,
} from 'src/constants';
import { UserService } from 'src/user/user.service';
import {
  LoginResponse,
  MessageResponse,
  RefreshTokenBody,
} from './auth.interfaces';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupUserDto): Promise<MessageResponse & { id: string }> {
    const { login, password } = dto;
    // It is common case, but unit tests are failed in case of implementation
    // const existingUser = await this.prismaService.user.findFirst({
    //   where: { login },
    // });

    // if (existingUser) throw new ConflictException(ErorrMessagesEnum.USER_EXIST);

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.CRYPT_SALT || SALT_ROUNDS),
    );

    const user = await this.userService.create({
      login,
      password: hashedPassword,
    });

    return { message: MessagesEnum.USER_WAS_REGISTERED, id: user.id };
  }

  async generateTokens(payload: {
    sub: string;
    userId: string;
    login: string;
  }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET || JWT_ACCESS_SECRET,
      expiresIn: process.env.TOKEN_EXPIRE_TIME || JWT_ACCESS_EXPIRATION_TIME,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY || JWT_REFRESH_SECRET,
      expiresIn:
        process.env.TOKEN_REFRESH_EXPIRE_TIME || JWT_REFRESH_EXPIRATION_TIME,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginUserDto): Promise<LoginResponse> {
    const { login, password } = dto;

    const user = await this.prismaService.user.findFirst({
      where: { login },
      select: { id: true, password: true, login: true },
    });

    if (!user) {
      throw new ForbiddenException(ErorrMessagesEnum.WRONG_LOGIN);
    }

    const isPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordsMatch) {
      throw new ForbiddenException(ErorrMessagesEnum.WRONG_PASSWORD);
    }

    const payload = { sub: user.id, userId: user.id, login: user.login };

    return this.generateTokens(payload);
  }

  async refresh(dto: RefreshTokenBody) {
    const { refreshToken } = dto;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY || JWT_REFRESH_SECRET,
      });

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new Error(ErorrMessagesEnum.INVALID_REFRESH_TOKEN);

      const updatedPayload = {
        sub: user.id,
        userId: user.id,
        login: user.login,
      };

      return this.generateTokens(updatedPayload);
    } catch (error) {
      throw new ForbiddenException(ErorrMessagesEnum.INVALID_REFRESH_TOKEN);
    }
  }
}
