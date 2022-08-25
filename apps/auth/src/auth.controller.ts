import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthService } from './auth.service';
import {
  CreateTenantDto,
  ForgotPasswordDto,
  RegisterUserDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from './mongodb';
import { UsersService } from './users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('userImage'))
  registerUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerUserInfo: RegisterUserDto,
  ) {
    return this.authService.registerUser(registerUserInfo, file);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    const user = req.user as UserDocument;
    return this.authService.loginUser(user);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const user = req.user as UserDocument;
    return this.authService.logoutUser(user);
  }

  @Post('forgot-password')
  @UseGuards(JwtAuthGuard)
  async forgotPassword(
    @Req() req: Request & { user: UserDocument },
    @Body() body: ForgotPasswordDto,
  ) {
    const admin = req.user as UserDocument;

    if (admin.role !== 'admin') {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneUser({ _id: body.userId });

    if (user.tenantId.toString() !== admin.tenantId.toString()) {
      throw new UnauthorizedException();
    }
    return this.authService.forgotPassword(user?._id.toString(), body.password);
  }

  @Patch('update-profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('userImage'))
  updateProfile(
    @Req() req: Request & { user: UserDocument },
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserInfo: { [key: string]: string },
  ) {
    const allowedUpdateKeys = ['name'];
    const updateKeys = Object.keys(updateUserInfo);
    if (updateKeys.length === 0) {
      throw new BadRequestException('Missing update fields');
    }

    for (const key of updateKeys) {
      if (allowedUpdateKeys.includes(key)) {
        if (!allowedUpdateKeys.includes(key)) {
          throw new BadRequestException(`Invalid update field: ${key}`);
        }
      }
    }

    const user = req.user as UserDocument;
    return this.authService.updateProfile(updateUserInfo, file, user._id);
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

  @Get('tenants')
  async getTenants(@Query('name') name: string) {
    return this.authService.getTenants(name);
  }
}
