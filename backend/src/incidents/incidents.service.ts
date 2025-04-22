// src/incidents/incidents.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './entities/incident.schema';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
  ) {}

  async create(data: any): Promise<Incident> {
    const incident = new this.incidentModel({
      ...data,
      location: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude],
      },
    });
    return incident.save();
  }

  async findAll(): Promise<Incident[]> {
    return this.incidentModel.find().exec();
  }

  async confirmIncident(id: string): Promise<Incident | null> { // ✅ corrigé ici
    return this.incidentModel.findByIdAndUpdate(
      id,
      { status: 'confirmed' },
      { new: true },
    );
  }

  async rejectIncident(id: string): Promise<Incident | null> { // ✅ corrigé ici
    return this.incidentModel.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true },
    );
  }

  async findNearby(lat: number, lng: number): Promise<Incident[]> {
    return this.incidentModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'dist.calculated',
          spherical: true,
          maxDistance: 5000, // 5km radius
        },
      },
    ]);
  }
}
