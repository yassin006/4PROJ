import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create({
      userId: body.userId,
      message: body.message,
      location: body.location, 
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.notificationsService.findAll();
  }
}
