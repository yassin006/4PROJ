import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './entities/incident.schema';
import { TrafficMonitorService } from '../traffic-monitor/traffic-monitor.service';
import { Server } from 'socket.io';

@Injectable()
export class IncidentsService {
  private io: Server;

  constructor(
    @InjectModel(Incident.name) private readonly incidentModel: Model<IncidentDocument>,
    private readonly trafficMonitorService: TrafficMonitorService,
  ) {}

  // ✅ Setter pour socket.io
  setSocketInstance(io: Server) {
    this.io = io;
  }

  async create(dto: any, userId: string, imageFilename?: string): Promise<Incident> {
    const incident = new this.incidentModel({
      ...dto,
      createdBy: userId,
      image: imageFilename,
    });

    await incident.save();

    // ✅ Émission socket
    this.io?.emit('incident:new', {
      _id: incident._id,
      title: incident.title,
      location: incident.location,
      type: incident.type,
      severity: incident.severity,
      createdAt: incident.createdAt,
      createdBy: incident.createdBy,
    });

    await this.trafficMonitorService.updateRouteBasedOnTraffic({
      incidentDetails: incident,
      trafficConditions: 'Traffic affected by incident',
    });

    return incident;
  }

  async validateIncident(id: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) throw new NotFoundException('Incident not found');
  
    // ⚠️ Vérifier que createdBy est présent
    if (!incident.createdBy) {
      throw new BadRequestException('Cannot validate incident: missing createdBy');
    }
  
    incident.validations += 1;
    await incident.save();
    return incident;
  }
  

  async invalidateIncident(id: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) throw new NotFoundException('Incident not found');
    incident.invalidations += 1;
    await incident.save();
    return incident;
  }

  async findNearbyIncidents(lat: number, lng: number): Promise<Incident[]> {
    return this.incidentModel.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: 5000,
        },
      },
    });
  }

  async findAll(): Promise<Incident[]> {
    return this.incidentModel.find().exec();
  }

  async delete(id: string): Promise<void> {
    await this.incidentModel.findByIdAndDelete(id);
  }

  async deleteUserIncident(incidentId: string, userId: string): Promise<void> {
    const incident = await this.incidentModel.findById(incidentId);
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    if (incident.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You are not allowed to delete this incident');
    }
    await this.incidentModel.findByIdAndDelete(incidentId);
  }
  
}
