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

  // ✅ Créer une notification manuellement
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create({
      userId: body.userId,
      message: body.message,
      location: body.location, // facultatif
    });
  }

  // ✅ Obtenir toutes les notifications d’un utilisateur
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  // ✅ Marquer une notification comme lue
  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  // ✅ Obtenir toutes les notifications (sans filtre)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.notificationsService.findAll();
  }
}
