import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';
import { Incident, IncidentSchema } from '../incidents/entities/incident.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Incident.name, schema: IncidentSchema },
    ]),
  ],
  controllers: [PredictionsController],
  providers: [PredictionsService],
})
export class PredictionsModule {}
