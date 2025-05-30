import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { User } from './user.interface';
import { CreateUserDto, UpdatePasswordDto } from './dto/createUser.dto';
import { ErorrMessagesEnum } from 'src/constants';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findById(id: string): User {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException(ErorrMessagesEnum.USER_NOT_FOUND);
    }

    return user;
  }

  create(dto: CreateUserDto): User {
    const { login, password } = dto;

    const timeStamp = Date.now();

    const newUser: User = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: timeStamp,
      updatedAt: timeStamp,
    };

    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, dto: UpdatePasswordDto): User {
    const { oldPassword, newPassword } = dto;

    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(ErorrMessagesEnum.USER_NOT_FOUND);
    }

    const user = this.users[userIndex];

    if (user.password !== oldPassword) {
      throw new ForbiddenException(ErorrMessagesEnum.WRONG_OLD_PASSWORD);
    }

    const updatedUser: User = {
      ...user,
      password: newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  delete(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(ErorrMessagesEnum.USER_NOT_FOUND);
    }

    this.users.splice(userIndex, 1);
  }
}
