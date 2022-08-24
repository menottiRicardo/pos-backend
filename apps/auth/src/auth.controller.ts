import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from './mongodb';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerUserInfo: RegisterUserDto) {
    return this.authService.registerUser(registerUserInfo);
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
    console.log('user is ', user);
    return this.authService.logoutUser(user);
  }
}
