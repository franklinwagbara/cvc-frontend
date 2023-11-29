import { Pipe, PipeTransform } from '@angular/core';
import { IApplication } from 'src/app/shared/interfaces/IApplication';

@Pipe({
  name: 'applicationsFilteredByCategory',
})
export class ApplicationsFilteredByCategoryPipe implements PipeTransform {
  transform(applications: IApplication[], ...args: unknown[]): IApplication[] {
    const [name] = args;
    return applications.filter((app) => app.category === name);
  }
}
