import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  tenantId: string;
}

export class RegisterUserDto extends LoginUserDto {
  @IsNotEmpty()
  @IsString()
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
