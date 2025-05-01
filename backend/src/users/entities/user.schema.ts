import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  name?: string;

  @Prop({ type: String })
  firstName?: string;

  @Prop({ type: String })
  lastName?: string;

  @Prop({ type: String })
  picture?: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, default: null })
  password?: string | null;

  @Prop({
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user',
  })
  role: 'user' | 'moderator' | 'admin';

  @Prop({ type: String, default: null })
  refreshToken?: string | null;

  @Prop({ type: String, default: null })
  resetToken?: string | null;

  @Prop({ type: Date, default: null })
  resetTokenExpiration?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
