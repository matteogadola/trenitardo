import { Line } from './line';
import { Run } from './run';

/**
 * Spiegazione dettagliata degli stati
 * shortened corsa conslusa prima della stazione prevista - il tratto successivo è cancellato
 * skipped-stops corse cui alcune fermate intermedie sono state saltate
 */

export type TripStatus =
  | 'unknown'
  | 'scheduled'
  | 'on-time'
  //| 'early'
  | 'delayed'
  | 'shortened'
  | 'skipped-stops'
  | 'rerouted'
  | 'partially-cancelled'
  | 'cancelled'
  | 'modified'
  | 'strike';

export type TripArrivalStatus = 'unknown' | 'on-time' | 'early' | 'delayed';

export interface Trip {
  id: string;
  date: string;
  origin: string;
  destination: string;
  departureTime: string;
  departureDelay: number;
  actualDepartureTime: string | null;
  arrivalTime: string;
  actualArrivalTime: string | null;
  delay: number;
  delayReason?: string;
  run: Pick<Run, 'id' | 'code' | 'origin' | 'originId' | 'destination' | 'destinationId' | 'direction'>;
  line: Pick<Line, 'id' | 'code' | 'type' | 'name'>;
  lastUpdate: string;
  lastStation?: string;
  status: TripStatus;
  statusMessage?: string;
  isDeparted: boolean;
  isCompleted: boolean;
  duration: number;
  stops: TripStop[];
}

export interface TripStop {
  id: string;
  name: string;
  scheduledTime: number | null;
  actualTime: number | null;
  status: TripStatus;
  delay: number;
}
