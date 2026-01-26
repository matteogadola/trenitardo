import { Line } from './line';

export type RunStatus = 'ON_TIME' | 'DELAYED' | 'CANCELLED';

export interface Run {
  id: string;
  code: string;
  codeName: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  originId: string;
  destination: string;
  destinationId: string;
  direction: number;
  line: Pick<Line, 'id' | 'code' | 'type' | 'name'>;
  createdAt: string;
  updatedAt: string;
  serviceDays: number[];
  servicePeriod: {
    startDate: string;
    endDate: string;
  };
  serviceExceptions: {
    excludedDates: string[];
    includedDates: string[];
  };
}

export interface RunForSchedule extends Run {
  date: string;
}
