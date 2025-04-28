import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './entities/incident.schema';
import { TrafficMonitorService } from '../traffic-monitor/traffic-monitor.service';  // Import TrafficMonitorService

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident.name) private readonly incidentModel: Model<IncidentDocument>,
    private readonly trafficMonitorService: TrafficMonitorService,  // Inject TrafficMonitorService
  ) {}

  // Create an incident
  async create(dto: any, userId: string, imageFilename?: string): Promise<Incident> {
    const incident = new this.incidentModel({ ...dto, createdBy: userId, image: imageFilename });
    await incident.save();

    // Trigger recalculation
    await this.trafficMonitorService.updateRouteBasedOnTraffic({
      incidentDetails: incident,
      trafficConditions: 'Traffic affected by incident', // Simulated traffic condition
    });

    return incident;
  }

  // Validate an incident (increment validation count)
  async validateIncident(id: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    incident.validations += 1;  // Increment validations count
    await incident.save();
    return incident;
  }

  // Invalidate an incident (increment invalidation count)
  async invalidateIncident(id: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    incident.invalidations += 1;  // Increment invalidations count
    await incident.save();
    return incident;
  }

  // Find nearby incidents within a specified radius
  async findNearbyIncidents(lat: number, lng: number): Promise<Incident[]> {
    return this.incidentModel.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: 5000, // Adjust this based on your distance requirement
        },
      },
    });
  }

  // Other methods such as recalculateRoute, etc.
}
