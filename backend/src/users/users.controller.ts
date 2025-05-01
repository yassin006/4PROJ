import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Accessible uniquement par les admins
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  // ✅ Supprimer un utilisateur (admin uniquement)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

  // ✅ Supprimer son propre compte
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteOwnAccount(@Req() req: any): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.usersService.deleteUser(userId);
    return { message: 'Your account has been deleted successfully' };
  }

  // ✅ Changer le rôle d'un utilisateur (admin uniquement)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: 'user' | 'admin' | 'moderator',
  ): Promise<{ message: string }> {
    await this.usersService.updateUserRole(id, role);
    return { message: `Role updated to "${role}" successfully` };
  }
}
