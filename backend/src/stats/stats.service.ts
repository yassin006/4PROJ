import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident } from '../incidents/entities/incident.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Incident.name)
    private readonly incidentModel: Model<Incident>,
  ) {}

  async getIncidentStats() {
    const total = await this.incidentModel.countDocuments();
    const byType = await this.incidentModel.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);
    const byStatus = await this.incidentModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return {
      totalIncidents: total,
      incidentsByType: byType,
      incidentsByStatus: byStatus,
    };
  }
}
