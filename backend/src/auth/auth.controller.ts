import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      if (error.code === 11000 || error instanceof ConflictException) {
        throw new ConflictException('Email already exists');
      }
      console.error('❌ Register exception:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as any;
    await this.authService.logout(user.userId);  // ✅ utilise `userId` et non `sub`
    return { message: 'Logout successful' };
  }
  

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  // 🌐 Redirection vers Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Rien à faire ici, juste redirection automatique
  }

// 🌐 Google OAuth2 callback
@Get('google/redirect')
@UseGuards(AuthGuard('google'))
async googleRedirect(@Req() req: Request) {
  const googleUser = req.user;
  const registeredUser = await this.authService.handleGoogleLogin(googleUser);

  // ✅ On passe un user complet avec `_id`
  const userPlain = (registeredUser as any).toObject?.() || registeredUser;

  return this.authService.login({
    ...userPlain,
    _id: userPlain._id, // 👈 Obligatoire pour le JWT
  });
}

  
}
