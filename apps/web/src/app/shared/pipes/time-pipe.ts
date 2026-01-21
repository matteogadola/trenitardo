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
