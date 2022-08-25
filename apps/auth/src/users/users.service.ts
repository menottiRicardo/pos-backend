import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../mongodb';
import { IFindUserFilter } from '../types/user.service.types';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async findOneUser(filter: IFindUserFilter): Promise<UserDocument> {
    return this.UserModel.findOne(filter);
  }
}
