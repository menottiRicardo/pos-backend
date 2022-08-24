import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTenantDto, RegisterUserDto } from './dto/auth.dto';
import { Tenant, TenantDocument, User, UserDocument } from './mongodb';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Tenant.name) private TenantModel: Model<TenantDocument>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
    tenantId: string,
  ): Promise<any> {
    const user = await this.userService.findOneUser({ username, tenantId });
    if (!user) {
      return null;
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async registerUser(registerUserInfo: RegisterUserDto) {
    const registeredUser = await this.UserModel.create(registerUserInfo);
    return registeredUser;
  }

  async loginUser(user: UserDocument) {
    const payload = { username: user.username, _id: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    user = await this.UserModel.findByIdAndUpdate(
      user._id,
      {
        accessToken,
      },
      { new: true },
    );
    return user;
  }

  async logoutUser(user: UserDocument) {
    await this.UserModel.updateOne(
      { _id: user._id },
      { $unset: { accessToken: 1 } },
    );
    return {
      message: 'User Logged out success.',
    };
  }

  async registerTenant(body: CreateTenantDto, file: Express.Multer.File) {
    if (file) {
      //TODO: write a function to upload a file
    }
    const createdTenant = await this.TenantModel.create(body);
    return createdTenant;
  }
}
