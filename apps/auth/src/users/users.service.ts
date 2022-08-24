import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../mongodb';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  //TODO: give types here
  async findOneUser(filter: any): Promise<UserDocument> {
    delete filter.tenantId;
    return this.UserModel.findOne(filter);
  }
}
