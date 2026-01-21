import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs',
})
export class AbsPipe implements PipeTransform {
  transform(value: number | null | undefined, second: number | null | undefined): number {
    if (!value || !second) return 0;

    return Math.abs(value - second);
  }
}
