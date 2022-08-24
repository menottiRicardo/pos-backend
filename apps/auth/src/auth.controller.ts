import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from './mongodb';

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
}
