import { Pipe, PipeTransform } from '@angular/core';
import { TripStatus } from '@repo/types';

@Pipe({
  name: 'mapTripStatus',
})
export class TripStatusPipe implements PipeTransform {
  transform(status: TripStatus): string {
    switch (status) {
      case 'on-time':
        return 'In orario';
      case 'delayed':
        return 'In ritardo';
      case 'cancelled':
        return 'Soppresso';
      case 'partially-cancelled':
        return 'Deviato';
      default:
        return 'Sconosciuto';
    }
  }
}
