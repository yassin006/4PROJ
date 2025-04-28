import { Injectable } from '@nestjs/common';
import { TrafficMonitorService } from '../traffic-monitor/traffic-monitor.service';
import { CalculateRouteDto } from './dto/calculate-route.dto';
import { RecalculateRouteDto } from './recalculate/dto/recalculate-route.dto';

@Injectable()
export class RoutesService {
  constructor(private readonly trafficMonitorService: TrafficMonitorService) {}

  calculateRoute(dto: CalculateRouteDto) {
    const { start, end, options } = dto;

    const distanceKm = this.getDistanceFromLatLonInKm(
      start.lat,
      start.lng,
      end.lat,
      end.lng,
    );

    const durationHours = distanceKm / (options?.avoidTolls ? 70 : 90);
    const durationMinutes = Math.round(durationHours * 60);

    const instructions: string[] = [];

    if (distanceKm < 10) {
      instructions.push('Utiliser les routes locales pour un trajet rapide');
    } else if (distanceKm < 50) {
      instructions.push('Suivre la nationale la plus proche');
    } else if (distanceKm < 100) {
      instructions.push('Prendre une route principale, attention aux bouchons');
    } else {
      instructions.push('Prendre l\'autoroute principale pour gagner du temps');
    }

    if (options?.avoidTolls) {
      instructions.push('Éviter les autoroutes à péage durant le trajet');
    }

    if (distanceKm > 80) {
      instructions.push('Faire une pause après 50 kilomètres');
    }

    if (distanceKm > 150) {
      instructions.push('Changer d\'autoroute à la jonction A7 direction Marseille');
    }

    instructions.push('Arriver à destination');

    return {
      route: [start, end],
      distance: `${distanceKm.toFixed(1)} km`,
      duration: `${durationMinutes} minutes`,
      instructions,
    };
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
