import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class RegisterUserDto extends LoginUserDto {
  @IsNotEmpty()
  name: string;
}
