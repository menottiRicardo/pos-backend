import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserType = {
  _id: string;
  role: string;
  photoUrl: string;
  password: string;
  name: string;
  username: string;
  tenantId: mongoose.Types.ObjectId;
  accessToken: string;
};

export type UserDocument = UserType & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  photoUrl: string;

  @Prop({
    required: true,
    enum: ['employee', 'admin', 'owner'],
    default: 'employee',
  })
  role: string;

  @Prop({ required: false, ref: 'tenants', default: null })
  tenantId: mongoose.Types.ObjectId;

  @Prop({ required: false })
  accessToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  const saltRounds = 10;
  this.password = bcrypt.hashSync(this.password, saltRounds);
  return next();
});
