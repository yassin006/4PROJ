import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TrafficMonitorService } from '../traffic-monitor/traffic-monitor.service'; 

@Module({
  imports: [],
  controllers: [RoutesController],
  providers: [RoutesService, TrafficMonitorService],  
})
export class RoutesModule {}
