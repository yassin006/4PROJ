import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IncidentsModule } from './incidents/incidents.module';
import { StatsModule } from './stats/stats.module';
import { PredictionsModule } from './predictions/predictions.module';
import { RoutesModule } from './routes/routes.module';
import { TrafficMonitorService } from './traffic-monitor/traffic-monitor.service';  // Ensure the service is imported
import { IncidentsService } from './incidents/incidents.service';  // Ensure the service is imported
import { IncidentSchema } from './incidents/entities/incident.schema'; // Ensure the schema is imported

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'docker'
        ? process.env.MONGODB_URI_DOCKER || 'mongodb://mongo:27017/trafine_db'
        : process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/trafine_db',
    ),
    MongooseModule.forFeature([{ name: 'Incident', schema: IncidentSchema }]),  // Correct schema linkage
    UsersModule,
    AuthModule,
    IncidentsModule,
    StatsModule,
    PredictionsModule,
    RoutesModule,
  ],
  providers: [
    IncidentsService,
    TrafficMonitorService,  // Ensure TrafficMonitorService is added here
  ], 
})
export class AppModule {}
