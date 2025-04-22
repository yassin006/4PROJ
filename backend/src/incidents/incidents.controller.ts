// src/incidents/incidents.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  async create(@Body() body: CreateIncidentDto) {
    return this.incidentsService.create(body);
  }

  @Get()
  async findAll() {
    return this.incidentsService.findAll();
  }

  @Patch(':id/confirm')
  async confirm(@Param('id') id: string) {
    return this.incidentsService.confirmIncident(id);
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    return this.incidentsService.rejectIncident(id);
  }

  @Get('/nearby')
  async findNearby(@Query('lat') lat: string, @Query('lng') lng: string) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new BadRequestException('Invalid latitude or longitude');
    }
    return this.incidentsService.findNearby(latitude, longitude);
  }
}
