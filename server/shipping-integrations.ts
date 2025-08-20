import express from 'express';

// Shipping API Integration Service for Polipus Platform
// Connects to Maersk, MSC, CMA CGM, and Hapag-Lloyd APIs

interface ShippingCredentials {
  maersk?: {
    apiKey: string;
    baseUrl: string;
  };
  msc?: {
    apiKey: string;
    baseUrl: string;
  };
  cmaCgm?: {
    apiKey: string;
    baseUrl: string;
  };
  hapagLloyd?: {
    apiKey: string;
    baseUrl: string;
  };
}

interface TrackingRequest {
  carrier: 'maersk' | 'msc' | 'cma-cgm' | 'hapag-lloyd';
  trackingNumber: string;
  type: 'container' | 'booking' | 'bill-of-lading';
}

interface ShipmentStatus {
  carrier: string;
  trackingNumber: string;
  status: string;
  location?: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  vesselInfo?: VesselInfo;
}

interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
  eventType: string;
}

interface VesselInfo {
  name: string;
  imo: string;
  voyage: string;
  eta?: string;
}

interface ScheduleRequest {
  origin: string;
  destination: string;
  departureDate?: string;
}

interface RouteSchedule {
  carrier: string;
  service: string;
  vessel: string;
  departure: string;
  arrival: string;
  transitTime: number;
  ports: PortCall[];
}

interface PortCall {
  port: string;
  arrival: string;
  departure: string;
}

export class ShippingIntegrationService {
  private credentials: ShippingCredentials = {};

  constructor() {
    // Load credentials from environment variables
    this.credentials = {
      maersk: {
        apiKey: process.env.MAERSK_API_KEY || '',
        baseUrl: 'https://api.maersk.com'
      },
      msc: {
        apiKey: process.env.MSC_API_KEY || '',
        baseUrl: 'https://api.msc.com'
      },
      cmaCgm: {
        apiKey: process.env.CMA_CGM_API_KEY || '',
        baseUrl: 'https://api-portal.cma-cgm.com'
      },
      hapagLloyd: {
        apiKey: process.env.HAPAG_LLOYD_API_KEY || '',
        baseUrl: 'https://api-portal.hlag.com'
      }
    };
  }

  // Track shipment across all carriers
  async trackShipment(request: TrackingRequest): Promise<ShipmentStatus | null> {
    try {
      switch (request.carrier) {
        case 'maersk':
          return await this.trackMaersk(request);
        case 'msc':
          return await this.trackMSC(request);
        case 'cma-cgm':
          return await this.trackCMACGM(request);
        case 'hapag-lloyd':
          return await this.trackHapagLloyd(request);
        default:
          throw new Error(`Unsupported carrier: ${request.carrier}`);
      }
    } catch (error) {
      console.error(`Tracking error for ${request.carrier}:`, error);
      return null;
    }
  }

  // Maersk API Integration
  private async trackMaersk(request: TrackingRequest): Promise<ShipmentStatus> {
    const response = await fetch(
      `${this.credentials.maersk?.baseUrl}/tracking/${request.trackingNumber}`,
      {
        headers: {
          'Authorization': `Bearer ${this.credentials.maersk?.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Maersk API error: ${response.status}`);
    }

    const data = await response.json();
    return this.formatMaerskResponse(data, request.trackingNumber);
  }

  // MSC API Integration
  private async trackMSC(request: TrackingRequest): Promise<ShipmentStatus> {
    const response = await fetch(
      `${this.credentials.msc?.baseUrl}/track-trace/${request.trackingNumber}`,
      {
        headers: {
          'Authorization': `Bearer ${this.credentials.msc?.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`MSC API error: ${response.status}`);
    }

    const data = await response.json();
    return this.formatMSCResponse(data, request.trackingNumber);
  }

  // CMA CGM API Integration
  private async trackCMACGM(request: TrackingRequest): Promise<ShipmentStatus> {
    const response = await fetch(
      `${this.credentials.cmaCgm?.baseUrl}/tracking/${request.trackingNumber}`,
      {
        headers: {
          'Authorization': `Bearer ${this.credentials.cmaCgm?.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`CMA CGM API error: ${response.status}`);
    }

    const data = await response.json();
    return this.formatCMACGMResponse(data, request.trackingNumber);
  }

  // Hapag-Lloyd API Integration
  private async trackHapagLloyd(request: TrackingRequest): Promise<ShipmentStatus> {
    const response = await fetch(
      `${this.credentials.hapagLloyd?.baseUrl}/shipments/${request.trackingNumber}/events`,
      {
        headers: {
          'Authorization': `Bearer ${this.credentials.hapagLloyd?.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Hapag-Lloyd API error: ${response.status}`);
    }

    const data = await response.json();
    return this.formatHapagLloydResponse(data, request.trackingNumber);
  }

  // Get schedules from multiple carriers
  async getSchedules(request: ScheduleRequest): Promise<RouteSchedule[]> {
    const schedules: RouteSchedule[] = [];

    try {
      // Fetch from all carriers in parallel
      const promises = [
        this.getMaerskSchedule(request),
        this.getMSCSchedule(request),
        this.getCMACGMSchedule(request),
        this.getHapagLloydSchedule(request)
      ];

      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          schedules.push(...result.value);
        }
      });

      return schedules;
    } catch (error) {
      console.error('Schedule fetch error:', error);
      return [];
    }
  }

  // Format response helpers
  private formatMaerskResponse(data: any, trackingNumber: string): ShipmentStatus {
    return {
      carrier: 'Maersk',
      trackingNumber,
      status: data.status || 'Unknown',
      location: data.location?.name,
      estimatedDelivery: data.estimatedTimeOfDelivery,
      events: data.events?.map((event: any) => ({
        timestamp: event.eventDateTime,
        location: event.eventLocation?.name || '',
        description: event.eventType,
        eventType: event.eventTypeCode
      })) || [],
      vesselInfo: data.vessel ? {
        name: data.vessel.name,
        imo: data.vessel.imo,
        voyage: data.vessel.voyage,
        eta: data.vessel.eta
      } : undefined
    };
  }

  private formatMSCResponse(data: any, trackingNumber: string): ShipmentStatus {
    return {
      carrier: 'MSC',
      trackingNumber,
      status: data.containerStatus || 'Unknown',
      location: data.currentLocation,
      estimatedDelivery: data.eta,
      events: data.milestones?.map((milestone: any) => ({
        timestamp: milestone.date,
        location: milestone.location,
        description: milestone.description,
        eventType: milestone.code
      })) || [],
      vesselInfo: data.vesselDetails ? {
        name: data.vesselDetails.name,
        imo: data.vesselDetails.imo,
        voyage: data.vesselDetails.voyage,
        eta: data.vesselDetails.eta
      } : undefined
    };
  }

  private formatCMACGMResponse(data: any, trackingNumber: string): ShipmentStatus {
    return {
      carrier: 'CMA CGM',
      trackingNumber,
      status: data.shipmentStatus || 'Unknown',
      location: data.lastKnownLocation,
      estimatedDelivery: data.estimatedTimeOfArrival,
      events: data.trackingEvents?.map((event: any) => ({
        timestamp: event.eventDate,
        location: event.location,
        description: event.eventDescription,
        eventType: event.eventCode
      })) || [],
      vesselInfo: data.vessel ? {
        name: data.vessel.vesselName,
        imo: data.vessel.vesselImo,
        voyage: data.vessel.voyageNumber,
        eta: data.vessel.eta
      } : undefined
    };
  }

  private formatHapagLloydResponse(data: any, trackingNumber: string): ShipmentStatus {
    return {
      carrier: 'Hapag-Lloyd',
      trackingNumber,
      status: data.shipmentStatus || 'Unknown',
      location: data.currentPosition,
      estimatedDelivery: data.eta,
      events: data.events?.map((event: any) => ({
        timestamp: event.eventDateTime,
        location: event.eventLocation,
        description: event.eventDescription,
        eventType: event.eventType
      })) || [],
      vesselInfo: data.vesselInformation ? {
        name: data.vesselInformation.vesselName,
        imo: data.vesselInformation.imoNumber,
        voyage: data.vesselInformation.voyageNumber,
        eta: data.vesselInformation.eta
      } : undefined
    };
  }

  // Schedule methods (simplified - would need actual API endpoints)
  private async getMaerskSchedule(request: ScheduleRequest): Promise<RouteSchedule[]> {
    // Implementation for Maersk schedules API
    return [];
  }

  private async getMSCSchedule(request: ScheduleRequest): Promise<RouteSchedule[]> {
    // Implementation for MSC schedules API
    return [];
  }

  private async getCMACGMSchedule(request: ScheduleRequest): Promise<RouteSchedule[]> {
    // Implementation for CMA CGM schedules API
    return [];
  }

  private async getHapagLloydSchedule(request: ScheduleRequest): Promise<RouteSchedule[]> {
    // Implementation for Hapag-Lloyd schedules API
    return [];
  }

  // Multi-carrier tracking - track same shipment across all carriers
  async trackMultiCarrier(trackingNumber: string): Promise<ShipmentStatus[]> {
    const carriers: Array<'maersk' | 'msc' | 'cma-cgm' | 'hapag-lloyd'> = 
      ['maersk', 'msc', 'cma-cgm', 'hapag-lloyd'];

    const promises = carriers.map(carrier => 
      this.trackShipment({
        carrier,
        trackingNumber,
        type: 'container'
      })
    );

    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<ShipmentStatus> => 
        result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);
  }

  // Health check for all APIs
  async healthCheck(): Promise<Record<string, boolean>> {
    const health = {
      maersk: false,
      msc: false,
      cmaCgm: false,
      hapagLloyd: false
    };

    try {
      // Simple health checks for each API
      const healthChecks = await Promise.allSettled([
        this.checkMaerskHealth(),
        this.checkMSCHealth(),
        this.checkCMACGMHealth(),
        this.checkHapagLloydHealth()
      ]);

      health.maersk = healthChecks[0].status === 'fulfilled';
      health.msc = healthChecks[1].status === 'fulfilled';
      health.cmaCgm = healthChecks[2].status === 'fulfilled';
      health.hapagLloyd = healthChecks[3].status === 'fulfilled';
    } catch (error) {
      console.error('Health check error:', error);
    }

    return health;
  }

  private async checkMaerskHealth(): Promise<void> {
    const response = await fetch(`${this.credentials.maersk?.baseUrl}/health`, {
      headers: { 'Authorization': `Bearer ${this.credentials.maersk?.apiKey}` }
    });
    if (!response.ok) throw new Error('Maersk API unhealthy');
  }

  private async checkMSCHealth(): Promise<void> {
    const response = await fetch(`${this.credentials.msc?.baseUrl}/health`, {
      headers: { 'Authorization': `Bearer ${this.credentials.msc?.apiKey}` }
    });
    if (!response.ok) throw new Error('MSC API unhealthy');
  }

  private async checkCMACGMHealth(): Promise<void> {
    const response = await fetch(`${this.credentials.cmaCgm?.baseUrl}/health`, {
      headers: { 'Authorization': `Bearer ${this.credentials.cmaCgm?.apiKey}` }
    });
    if (!response.ok) throw new Error('CMA CGM API unhealthy');
  }

  private async checkHapagLloydHealth(): Promise<void> {
    const response = await fetch(`${this.credentials.hapagLloyd?.baseUrl}/health`, {
      headers: { 'Authorization': `Bearer ${this.credentials.hapagLloyd?.apiKey}` }
    });
    if (!response.ok) throw new Error('Hapag-Lloyd API unhealthy');
  }
}

export const shippingService = new ShippingIntegrationService();