import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { RoutingPathsEnum } from 'src/constants';
import { UserService } from './user.service';
import { ParseUUDIPipe } from 'src/shared/pipes/parse-uudi.pipe';
import { CreateUserDto, UpdatePasswordDto } from './dto/createUser.dto';
import { UserEntity } from './dto/userEntity.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller(RoutingPathsEnum.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    const users = this.userService.findAll();
    const formattedArr = users.map((user) => new UserEntity(user));
    return formattedArr;
  }

  @Get(':id')
  findOne(@Param('id', ParseUUDIPipe) id: string): UserEntity {
    return new UserEntity(this.userService.findById(id));
  }

  @Post()
  create(@Body() dto: CreateUserDto): UserEntity {
    return new UserEntity(this.userService.create(dto));
  }

  @Put(':id')
  update(
    @Param('id', ParseUUDIPipe) id: string,
    @Body() dto: UpdatePasswordDto,
  ): UserEntity {
    return new UserEntity(this.userService.updateUser(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseUUDIPipe) id: string) {
    return this.userService.delete(id);
  }
}
