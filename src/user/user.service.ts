import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdatePasswordDto } from './dto/createUser.dto';
import { ErorrMessagesEnum } from 'src/constants';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaSerice: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prismaSerice.user.findMany();
  }

  async findById(id: string): Promise<User> {
    const user = await this.prismaSerice.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(ErorrMessagesEnum.USER_NOT_FOUND);
    }

    return user;
  }

  async create(dto: Prisma.UserCreateInput): Promise<User> {
    return this.prismaSerice.user.create({ data: dto });
  }

  async updateUser(id: string, dto: UpdatePasswordDto): Promise<User> {
    const { oldPassword, newPassword } = dto;

    const user = await this.findById(id);

    if (user.password !== oldPassword) {
      throw new ForbiddenException(ErorrMessagesEnum.WRONG_OLD_PASSWORD);
    }

    return this.prismaSerice.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: user.version + 1,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    return this.prismaSerice.user.delete({ where: { id } });
  }
}
