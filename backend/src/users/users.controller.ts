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
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

@UseGuards(JwtAuthGuard)
@Delete('me')
async deleteOwnAccount(@Req() req: any): Promise<{ message: string }> {
  const userId = req.user.userId;
  await this.usersService.deleteUser(userId);
  return { message: 'Your account has been deleted successfully' };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
async delete(@Param('id') id: string): Promise<{ message: string }> {
  await this.usersService.deleteUser(id);
  return { message: 'User deleted successfully' };
}


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

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const userId = req.user.userId;
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/profile-image')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/(jpg|jpeg|png|webp)$/)) {
          cb(new Error('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadProfileImage(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User | null> {
    const userId = req.user.userId;
    return this.usersService.updateUser(userId, { profileImage: file.filename });
  }
}
