import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Request } from 'express';

import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  // ✅ Create incident (authenticated users)
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/incidents',
        filename: (_req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User ID missing from request');
    }

    const imageFilename = image?.filename ?? null;
    const parsedLocation =
      typeof body.location === 'string'
        ? JSON.parse(body.location)
        : body.location;

    return this.incidentsService.create(
      {
        title: body.title,
        description: body.description,
        type: body.type,
        location: parsedLocation,
      },
      userId,
      imageFilename,
    );
  }

  // ✅ Get all incidents (admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return this.incidentsService.findAll();
  }

  // ✅ Validate incident (admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/validate')
  async validate(@Param('id') id: string) {
    return this.incidentsService.validateIncident(id);
  }

  // ✅ Find nearby incidents
  @UseGuards(JwtAuthGuard)
  @Get('nearby')
  async findNearbyIncidents(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    return this.incidentsService.findNearbyIncidents(latitude, longitude);
  }

  // ✅ DELETE own incident
  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  async deleteUserIncident(
    @Param('id') incidentId: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    await this.incidentsService.deleteUserIncident(incidentId, user.userId);
    return { message: 'Incident deleted successfully.' };
  }

  // ✅ DELETE any incident (admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteIncidentAsAdmin(@Param('id') incidentId: string) {
    await this.incidentsService.delete(incidentId);
    return { message: 'Incident deleted by admin.' };
  }
}
