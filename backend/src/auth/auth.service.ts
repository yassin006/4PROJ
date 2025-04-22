// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/entities/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: any) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);

      return await this.usersService.create({
        ...data,
        password: hashedPassword,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      console.error('❌ Register error:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userDoc = user as UserDocument;
    const { password, ...userWithoutPassword } = userDoc.toObject();
    return { ...userWithoutPassword, _id: userDoc._id };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id }; // ✅ sub = _id
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
  
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshToken(user._id, hashedRefreshToken);
  
    return {
      access_token,
      refresh_token,
    };
  }
  

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findById(decoded.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isMatch = await bcrypt.compare(token, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const userDoc = user as UserDocument;
      const newAccessToken = this.jwtService.sign(
        { email: userDoc.email, sub: userDoc._id },
        { expiresIn: '1h' },
      );

      return { access_token: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  // 🌐 Persistance et gestion utilisateur Google
  async handleGoogleLogin(profile: any) {
    const existingUser = await this.usersService.findByEmail(profile.email);

    if (existingUser) {
      return existingUser;
    }

    // Nouveau compte Google => créer un utilisateur sans mot de passe
    const newUser = await this.usersService.create({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      picture: profile.picture,
      password: null,
    });

    return newUser;
  }
}
