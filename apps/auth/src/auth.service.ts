import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/auth.dto';
import { User, UserDocument } from './mongodb';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
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

  loginUser(user: UserDocument) {
    const payload = { username: user.username, _id: user._id, role: user.role };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
