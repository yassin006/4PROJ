import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { Incident, IncidentSchema } from './entities/incident.schema';  // Ensure Incident is imported correctly
import { TrafficMonitorService } from '../traffic-monitor/traffic-monitor.service'; // Import TrafficMonitorService
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Incident.name, schema: IncidentSchema }]),  // Correctly link the IncidentModel to Mongoose
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService, TrafficMonitorService, NotificationsGateway],  // Add TrafficMonitorService here
  exports: [IncidentsService],
})
export class IncidentsModule {}
