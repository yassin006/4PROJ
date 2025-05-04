// src/routes/routes.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CalculateRouteDto } from './dto/calculate-route.dto';
import { RecalculateRouteDto } from './recalculate/dto/recalculate-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post('calculate')
  async calculateRoute(@Body() calculateRouteDto: CalculateRouteDto) {
    return this.routesService.calculateRoute(calculateRouteDto);
  }

  @Post('recalculate')
  recalculateRoute(@Body() recalculateRouteDto: RecalculateRouteDto) {
    const { start, end, incident } = recalculateRouteDto;
    return this.routesService.recalculateRoute(start, end, incident);
  }
  
}
