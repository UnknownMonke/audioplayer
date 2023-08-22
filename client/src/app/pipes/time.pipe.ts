import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format time in 'HH:mm:ss'.
 */
@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {

  /** @param value time in s (float). */
  transform(value: number): string {
    let hh = '';
    let mm = '';
    let ss = '';

    const valueInSeconds = Math.round(value);
    const minutes = Math.floor(valueInSeconds / 60);
    const hours = Math.floor(minutes / 60);

    hh = ('0' + hours).slice(-2);
    mm = ('0' + Math.floor(minutes % 60)).slice(-2);
    ss = ('0' + Math.floor(valueInSeconds % 60)).slice(-2);

    if (hours === 0) {
      return `${mm}:${ss}`;
    } else {
      return `${hh}:${mm}:${ss}`;
    }
  }
}
