import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/auth.dto';
import { User, UserDocument } from './mongodb';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async registerUser(registerUserInfo: RegisterUserDto) {
    const registeredUser = await this.UserModel.create(registerUserInfo);
    return registeredUser;
  }
}
