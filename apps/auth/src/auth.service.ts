import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTenantDto, RegisterUserDto } from './dto/auth.dto';
import { Tenant, TenantDocument, User, UserDocument } from './mongodb';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from './helper/s3.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Tenant.name) private TenantModel: Model<TenantDocument>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly s3Service: S3Service,
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

  async validateTenantId(tenantId: string) {
    const tenant = await this.TenantModel.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async registerUser(
    registerUserInfo: RegisterUserDto & { photoUrl?: string },
    file: Express.Multer.File,
  ) {
    await this.validateTenantId(registerUserInfo.tenantId);
    if (file) {
      const data = await this.s3Service.uploadFile(file);
      if (data?.Location) {
        registerUserInfo.photoUrl = data.Location;
      }
    }
    const registeredUser = await this.UserModel.create(registerUserInfo);
    await this.TenantModel.updateOne(
      { _id: registeredUser.tenantId },
      { $inc: { registerUsers: 1 } },
    );
    return registeredUser;
  }

  async updateProfile(
    updateUserInfo: any,
    file: Express.Multer.File,
    userID: string,
  ) {
    const updatePayload = {
      ...updateUserInfo,
    };
    if (file) {
      const data = await this.s3Service.uploadFile(file);
      if (data?.Location) {
        updatePayload['photoUrl'] = data.Location;
      }
    }
    const updatedUser = await this.UserModel.findByIdAndUpdate(
      userID,
      updatePayload,
      {
        new: true,
      },
    );
    return updatedUser;
  }

  async loginUser(user: UserDocument) {
    const payload = {
      username: user.username,
      _id: user._id,
      role: user.role,
      tenantId: user.tenantId,
    };
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

  async registerTenant(
    body: CreateTenantDto & { photoUrl?: string; ownerPhotoUrl?: string },
    file: Express.Multer.File,
  ) {
    if (file) {
      const data = await this.s3Service.uploadFile(file);
      if (data?.Location) {
        body.photoUrl = data.Location;
      }
    }
    const createdTenant = await this.TenantModel.create(body);
    const createOwnerPayload = {
      username: body.ownerUsername,
      password: body.ownerPassword,
      name: body.ownerName,
      tenantId: createdTenant._id,
      role: 'owner',
    };
    await this.UserModel.create(createOwnerPayload);
    return createdTenant;
  }

  async getTenants(name: string) {
    const findTenantsPayload = {};
    if (name) {
      findTenantsPayload['name'] = { $regex: name, $options: 'ig' };
    }
    return this.TenantModel.find(findTenantsPayload)
      .sort({ registerUsers: -1 })
      .limit(100);
  }
}
