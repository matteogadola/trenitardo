import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (!value) return '';

    const str = value.toString();
    return str.slice(0, -2) + ':' + str.slice(-2);
  }
}

@Pipe({
  name: 'readableDuration',
})
export class ReadableDurationPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (!value) return '';

    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    let text = '';

    if (hours > 0) {
      text += `${hours} ${hours === 1 ? 'ora' : 'ore'}`;
    }

    if (minutes > 0) {
      text += ` e ${minutes} ${minutes === 1 ? 'minuto' : 'minuti'}`;
    }

    return text;
  }
}
