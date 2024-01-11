import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbreviatevalue'
})
export class AbbreviateNumberPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value) {
      const num = Number((value as string));
      if (num == 0) {
        return 'O'
      } else {   
        // hundreds
        if (num <= 999) {
          return value;
        }     
        // thousands
        if(num >= 1000 && num <= 999999){
          return Math.floor(num / 1000) + 'K';
        }
        // millions
        if(num >= 1000000 && num <= 999999999){
          return Math.floor(num / 1000000) + 'M';
        }
        // billions
        if (num >= 1000000000 && num <= 999999999999) {
          return Math.floor(num / 1000000000) + 'B';
        }
        // trillions
        else if (num >= 1000000000000 && num <= 999999999999999) {
          return Math.floor(num / 1000000000000) + 'T';
        }
        else {
          return '>1T';
        }
      }
    }
    return null;
  }
}

