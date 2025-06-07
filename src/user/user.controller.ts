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
  async findAll() {
    const users = await this.userService.findAll();
    const formattedArr = users.map((user) => new UserEntity(user));
    return formattedArr;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUDIPipe) id: string): Promise<UserEntity> {
    const user = await this.userService.findById(id);
    return new UserEntity(user);
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userService.create(dto);
    return new UserEntity(user);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUDIPipe) id: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<UserEntity> {
    const user = await this.userService.updateUser(id, dto);
    return new UserEntity(user);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUDIPipe) id: string) {
    return this.userService.delete(id);
  }
}
