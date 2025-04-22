import { Controller, Get, UseGuards } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get('congestion')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCongestionPrediction() {
    return this.predictionsService.predictCongestion();
  }
}
