import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './entities/incident.schema';
import { TrafficMonitorService } from '../traffic-monitor/traffic-monitor.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident.name) private readonly incidentModel: Model<IncidentDocument>,
    private readonly trafficMonitorService: TrafficMonitorService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  // ✅ Create an incident + real-time notification
  async create(dto: any, userId: string, imageFilename?: string): Promise<Incident> {
    const incident = new this.incidentModel({
      ...dto,
      createdBy: userId,
      image: imageFilename,
    });

    await incident.save();

    // ✅ Envoi de notification en temps réel
    this.notificationsGateway.sendIncidentNotification({
      _id: incident._id,
      title: incident.title,
      location: incident.location,
      type: incident.type,
      severity: incident.severity,
      createdAt: incident.createdAt,
      createdBy: incident.createdBy,
    });

    // ✅ Déclenche recalcul du trafic (si implémenté)
    await this.trafficMonitorService.updateRouteBasedOnTraffic({
      incidentDetails: incident,
      trafficConditions: 'Traffic affected by incident',
    });

    return incident;
  }

  // ✅ Validate an incident
  async validateIncident(id: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) throw new NotFoundException('Incident not found');
    incident.validations += 1;
    await incident.save();
    return incident;
  }

  // ✅ Invalidate an incident
  async invalidateIncident(id: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) throw new NotFoundException('Incident not found');
    incident.invalidations += 1;
    await incident.save();
    return incident;
  }

  // ✅ Get incidents near a given point
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

  // ✅ Admin - get all incidents
  async findAll(): Promise<Incident[]> {
    return this.incidentModel.find().exec();
  }

  // ✅ Admin - delete incident
  async delete(id: string): Promise<void> {
    await this.incidentModel.findByIdAndDelete(id);
  }
}
