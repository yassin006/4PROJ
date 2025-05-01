// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    try {
      const objectId = new Types.ObjectId(id);
      return await this.userModel.findById(objectId);
    } catch (err) {
      console.error('Invalid ObjectId:', id);
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async updateRefreshToken(userId: string, token: string | null): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { refreshToken: token },
      { new: true },
    );
  }

  async findOrCreateGoogleUser(profile: any): Promise<UserDocument> {
    const existingUser = await this.findByEmail(profile.email);
    if (existingUser) {
      return existingUser;
    }

    return this.create({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      picture: profile.picture,
      role: 'user',
      password: undefined, // pour éviter les erreurs
    });
  }

  async setResetToken(email: string, token: string, expiration: Date) {
    return this.userModel.findOneAndUpdate(
      { email },
      {
        resetToken: token,
        resetTokenExpiration: expiration,
      },
      { new: true },
    );
  }
  
  async findByResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: new Date() },
    });
  }
  
  async clearResetToken(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      resetToken: null,
      resetTokenExpiration: null,
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async UserdeleteUser(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
  
  async updateUserRole(id: string, role: 'user' | 'admin' | 'moderator'): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { role });
  }
  
  
}
