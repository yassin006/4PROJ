import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { Incident, IncidentSchema } from './entities/incident.schema';
import { TrafficMonitorService } from '../traffic-monitor/traffic-monitor.service';
import { NotificationsModule } from '../notifications/notifications.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Incident.name, schema: IncidentSchema },
    ]),
    NotificationsModule, 
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService, TrafficMonitorService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
