import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

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

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  createTenantSecret: string;
}
