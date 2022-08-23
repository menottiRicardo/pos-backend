import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TenantType = {
  _id: string;
  name: string;
  photoUrl: string;
  registerUsers: number;
};

export type TenantDocument = TenantType & Document;

@Schema({
  timestamps: true,
  collection: 'tenants',
})
export class Tenant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  photoUrl: string;

  @Prop({ required: true })
  registerUsers: number;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
