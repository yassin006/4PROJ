// src/routes/routes.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { TrafficMonitorService } from '../traffic-monitor/traffic-monitor.service';
import { CalculateRouteDto } from './dto/calculate-route.dto';
import { RecalculateRouteDto } from './recalculate/dto/recalculate-route.dto';

@Injectable()
export class RoutesService {
  constructor(private readonly trafficMonitorService: TrafficMonitorService) {}

  async calculateRoute(dto: CalculateRouteDto) {
    const { start, end, options } = dto;
    const apiKey = process.env.ORS_API_KEY;

    const coordinates = [
      [start.lng, start.lat],
      [end.lng, end.lat],
    ];

    const requestBody = {
      coordinates,
      instructions: true,
      preference: options?.avoidTolls ? 'recommended' : 'fastest',
      options: options?.avoidTolls ? { avoid_features: ['tollways'] } : {},
      format: 'json',
    };
    

    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        requestBody,
        {
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      const routeData = response.data.routes[0];
      const distanceKm = routeData.summary.distance / 1000;
      const durationMin = Math.round(routeData.summary.duration / 60);
      const instructions = routeData.segments[0]?.steps?.map((step: any) => step.instruction) || [];

      return {
        route: coordinates,
        distance: `${distanceKm.toFixed(1)} km`,
        duration: `${durationMin} minutes`,
        instructions,
      };
    } catch (error) {
      console.error('❌ ORS API ERROR:', error.response?.status, error.response?.data || error.message);

      // fallback: manual estimate
      const distanceKm = this.getDistanceFromLatLonInKm(
        start.lat, start.lng, end.lat, end.lng
      );
      const durationHours = distanceKm / (options?.avoidTolls ? 70 : 90);
      const durationMinutes = Math.round(durationHours * 60);

      const instructions = ['Arriver à destination (fallback calculé localement)'];

      return {
        route: coordinates,
        distance: `${distanceKm.toFixed(1)} km`,
        duration: `${durationMinutes} minutes`,
        instructions,
      };
    }
  }

  async recalculateRoute(dto: RecalculateRouteDto) {
    const { start, end, incident } = dto;

    const trafficData = await this.trafficMonitorService.getTrafficConditions(incident);

    if (trafficData.isTrafficHeavy) {
      return this.avoidTraffic(start, end, trafficData);
    } else {
      return {
        route: [start, end],
        message: 'No need to recalculate route, traffic is clear.',
      };
    }
  }

  private avoidTraffic(start: any, end: any, trafficData: any) {
    const newRoute = [
      start,
      { lat: start.lat + 0.1, lng: start.lng + 0.1 },
      end,
    ];

    return {
      newRoute,
      message: 'Traffic detected, recalculating route to avoid congestion.',
    };
  }

  private getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
