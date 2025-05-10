import { Injectable } from '@nestjs/common';

@Injectable()
export class TrafficMonitorService {
  async getTrafficConditions(incident: any): Promise<any> {
    console.log('Checking traffic conditions for incident:', incident);
    return { isTrafficHeavy: true, trafficConditions: 'Heavy Traffic' };
  }

  async updateRouteBasedOnTraffic(data: any): Promise<any> {
    const { incidentDetails, trafficConditions } = data;
    console.log('Updating route based on traffic:', { incidentDetails, trafficConditions });

    if (!incidentDetails.start || !incidentDetails.end) {
      console.error('Incident details are missing start or end coordinates:', incidentDetails);
      return { message: 'Invalid incident data for route calculation.' };
    }

    const newRoute = [
      incidentDetails.start,
      { lat: incidentDetails.start.lat + 0.1, lng: incidentDetails.start.lng + 0.1 },  // Detour point
      incidentDetails.end,
    ];

    return {
      newRoute,
      message: 'Route updated due to traffic.',
      trafficConditions,
    };
  }
}
