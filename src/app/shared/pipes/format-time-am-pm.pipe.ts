import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimeAmPm'
})
export class FormatTimeAmPmPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value) {
      const date = new Date(value as string);
      const dateString = date.toString().replace(/\d+:\d+:\d+ GMT.+\d+ \(West Africa Standard Time\)/gi, date.toLocaleTimeString());
      const formatted = dateString.replace(/([a-z]{3}) ([a-z]{3} \d{2}) (\d{4})/i, '$1, $2, $3, ')
      return formatted;
    }
    return null;
  }

}
