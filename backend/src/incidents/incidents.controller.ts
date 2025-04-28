import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  // Create an incident
  @UseGuards(JwtAuthGuard)
  @Post()
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
    @Request() req: any,
  ) {
    const { title, description, type, location } = body;
    const userId = req.user.userId;
    const imageFilename = image?.filename ?? null;

    let parsedLocation: { type: string; coordinates: number[] };

    // Parse location from string to object if necessary
    if (typeof location === 'string') {
      parsedLocation = JSON.parse(location);
    } else {
      parsedLocation = location;
    }

    // Call the create method from IncidentsService
    return this.incidentsService.create(
      {
        title,
        description,
        type,
        location: parsedLocation,
      },
      userId,
      imageFilename,
    );
  }

  // Validate an incident
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @Post(':id/validate')
  async validateIncident(@Param('id') id: string) {
    // Call the validateIncident method from IncidentsService
    return this.incidentsService.validateIncident(id);
  }

  // Invalidate an incident
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @Post(':id/invalidate')
  async invalidateIncident(@Param('id') id: string) {
    // Call the invalidateIncident method from IncidentsService
    return this.incidentsService.invalidateIncident(id);
  }

  // Find nearby incidents
  @UseGuards(JwtAuthGuard)
  @Get('nearby')
  async findNearbyIncidents(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Call the findNearbyIncidents method from IncidentsService
    return this.incidentsService.findNearbyIncidents(latitude, longitude);
  }
}
