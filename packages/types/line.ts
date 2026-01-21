import { Corridor } from './corridor';

export type LineType = 'Regionale' | 'RegioExpress';
export type LineStatus = 'active' | 'inactive';

export interface Line {
  id: string;
  code: string;
  codeName: string;
  type: LineType;
  name: string;
  corridor: Pick<Corridor, 'id' | 'code' | 'name'>;
  createdAt: string;
  updatedAt: string;
  status: LineStatus;
}
