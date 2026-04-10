export type TripStatus = 'scheduled' | 'boarding' | 'in_transit' | 'delayed' | 'arrived';
export type StaffRole = 'driver' | 'supervisor' | 'admin';
export type SeatType = 'AC' | 'Non-AC';
export type SignalQuality = 'strong' | 'moderate' | 'weak' | 'offline';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  avatar?: string;
}

export interface RouteStop {
  id: string;
  name: string;
  shortName: string;
  scheduledTime: string;
  actualTime?: string;
  completed: boolean;
  isCurrent: boolean;
  isOrigin: boolean;
  isDestination: boolean;
  isBreakPoint?: boolean;
  passengerPickup?: number;
  passengerDrop?: number;
}

export interface TripPassengerSummary {
  totalPassengers: number;
  bookedSeats: number;
  availableSeats: number;
  totalSeats: number;
  seatType: SeatType;
  fareType: string;
}

export interface GPSData {
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  accuracy: number;
  lastUpdated: string;
  signalQuality: SignalQuality;
}

export interface Trip {
  id: string;
  tripCode: string;
  routeName: string;
  origin: string;
  destination: string;
  busName: string;
  busRegistration: string;
  departureTime: string;
  expectedArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  status: TripStatus;
  driver: StaffMember;
  supervisor?: StaffMember;
  passengers: TripPassengerSummary;
  stops: RouteStop[];
  gps?: GPSData;
  isLive: boolean;
  delayMinutes?: number;
  delayReason?: string;
  delayNote?: string;
}

export interface DelayReport {
  reason: string;
  customNote?: string;
  estimatedDelay: number;
}

export const DELAY_REASONS = [
  'Traffic congestion',
  'Road construction',
  'Weather conditions',
  'Mechanical issue',
  'Passenger delay at stop',
  'Ferry/bridge delay',
  'Accident on route',
  'Police checkpoint',
  'Other',
] as const;

export const STATUS_CONFIG: Record<TripStatus, { label: string; color: string; bgClass: string; textClass: string }> = {
  scheduled: { label: 'Scheduled', color: 'info', bgClass: 'bg-info/15 border-info/30', textClass: 'text-info' },
  boarding: { label: 'Boarding', color: 'warning', bgClass: 'bg-warning/15 border-warning/30', textClass: 'text-warning' },
  in_transit: { label: 'In Transit', color: 'success', bgClass: 'bg-success/15 border-success/30', textClass: 'text-success' },
  delayed: { label: 'Delayed', color: 'destructive', bgClass: 'bg-destructive/15 border-destructive/30', textClass: 'text-destructive' },
  arrived: { label: 'Arrived', color: 'accent', bgClass: 'bg-accent/15 border-accent/30', textClass: 'text-accent' },
};
