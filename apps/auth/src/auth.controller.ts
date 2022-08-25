import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateTenantDto, RegisterUserDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from './mongodb';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('user_image'))
  registerUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerUserInfo: RegisterUserDto,
  ) {
    return this.authService.registerUser(registerUserInfo, file);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    const user = req.user as UserDocument;
    return this.authService.loginUser(user);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    const user = req.user as UserDocument;
    return this.authService.logoutUser(user);
  }

  @Post('register-tenant')
  @UseInterceptors(FileInterceptor('tenant_logo'))
  async registerTenant(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateTenantDto,
  ) {
    if (body.createTenantSecret !== process.env.CREATE_TENANT_SECRET) {
      throw new BadRequestException('Invalid create tenant secret');
    }
    if (!file) {
      throw new BadRequestException('Missing tenant logo');
    }
    return this.authService.registerTenant(body, file);
  }
}
