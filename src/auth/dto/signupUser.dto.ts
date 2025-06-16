import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password should have length more than 6 symbols.' })
  password: string;
}
