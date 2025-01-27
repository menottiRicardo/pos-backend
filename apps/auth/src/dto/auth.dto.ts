import { IsNotEmpty, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  ownerUsername: string;

  @IsNotEmpty()
  @IsString()
  ownerPassword: string;

  @IsNotEmpty()
  @IsString()
  ownerName: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
