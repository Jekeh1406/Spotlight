import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryFlag',
  standalone: true,
})
export class CountryFlagPipe implements PipeTransform {
  transform(countryCode: string): string {
    if (!countryCode) return '';
    return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
  }
}
