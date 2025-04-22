import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from '../incidents/entities/incident.schema';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectModel(Incident.name) private readonly incidentModel: Model<IncidentDocument>,
  ) {}

  async predictCongestion() {
    const results = await this.incidentModel.aggregate([
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 3,
      },
    ]);

    return {
      predictionBasis: 'historique incidents par heure',
      mostCongestedHours: results.map(r => ({
        hour: r._id,
        incidents: r.count,
      })),
    };
  }
}
