import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('incidents')
  async getIncidentStats() {
    return this.statsService.getIncidentStats();
  }
}
