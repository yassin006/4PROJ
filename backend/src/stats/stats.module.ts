import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Incident, IncidentSchema } from '../incidents/entities/incident.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Incident.name, schema: IncidentSchema }])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
