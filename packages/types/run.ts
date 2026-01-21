import { Line } from './line';

export type RunStatus = 'ON_TIME' | 'DELAYED' | 'CANCELLED';

export interface Run {
  id: string;
  code: string;
  codeName: string;
  type: string;
  name: string;
  departureTime: number;
  arrivalTime: number;
  origin: string;
  originId: string;
  destination: string;
  destinationId: string;
  direction: number;
  isScheduled: boolean;
  isScrapable: boolean;
  status: string;
  line: Pick<Line, 'id' | 'code' | 'type' | 'name'>;
  createdAt: string;
  updatedAt: string;
}
