import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './entities/incident.schema';
import { TrafficMonitorService } from '../traffic-monitor/traffic-monitor.service';
import { Server } from 'socket.io';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class IncidentsService {
  private io: Server;

  constructor(
    @InjectModel(Incident.name)
    private readonly incidentModel: Model<IncidentDocument>,
    private readonly trafficMonitorService: TrafficMonitorService,
    private readonly notificationsService: NotificationsService,
  ) {}

  setSocketInstance(io: Server) {
    this.io = io;
  }

  async create(dto: any, userId: string, imageFilename?: string): Promise<Incident> {
    const incident = new this.incidentModel({
      ...dto,
      createdBy: userId,
      image: imageFilename,
      validations: 0,
      invalidations: 0,
      validationScore: 0,
      status: 'pending',
      source: 'user',
      validatedBy: [],
      invalidatedBy: [],
    });

    await incident.save();

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

    try {
      const coordinates = incident.location?.coordinates;
      if (coordinates) {
        await this.notificationsService.create({
          userId,
          message: `New incident reported: ${incident.title}`,
          location: { type: 'Point', coordinates },
        });
      }
    } catch (error) {
      console.error('Failed to create notification:', error.message);
    }

    return incident;
  }

  async validateIncident(id: string, userId: string, role: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) throw new NotFoundException('Incident not found');

    if (role !== 'admin' && incident.validatedBy.includes(userId)) {
      throw new UnauthorizedException('User has already validated this incident');
    }

    incident.validationScore++;
    incident.validations++;

    if (role !== 'admin') {
      incident.validatedBy.push(userId);
    }

    if (incident.validationScore >= 3) {
      incident.status = 'validated';
    }

    await incident.save();
    return incident;
  }

  async invalidateIncident(id: string, userId: string, role: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) throw new NotFoundException('Incident not found');

    if (role !== 'admin' && incident.invalidatedBy.includes(userId)) {
      throw new UnauthorizedException('User has already invalidated this incident');
    }

    incident.validationScore--;
    incident.invalidations++;

    if (role !== 'admin') {
      incident.invalidatedBy.push(userId);
    }

    if (incident.validationScore <= -3) {
      await incident.deleteOne();
      throw new NotFoundException('Incident deleted due to excessive invalidations');
    }

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
