import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenDetectorService {
  public isXSmall: boolean;
  public isSmall: boolean;
  public isMedium: boolean;
  public isLarge: boolean;
  public isXLarge: boolean;

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    breakPointObserver: BreakpointObserver,
  ) {
    breakPointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (this.displayNameMap.get(query) === 'XSmall') {
          this.isXSmall = result.breakpoints[query];
        }
        if (this.displayNameMap.get(query) === 'Small') {
          this.isSmall = result.breakpoints[query];
        }
        if (this.displayNameMap.get(query) === 'Medium') {
          this.isMedium = result.breakpoints[query];
        }
        if (this.displayNameMap.get(query) === 'Large') {
          this.isLarge = result.breakpoints[query];
        }
        if (this.displayNameMap.get(query) === 'XLarge') {
          this.isXLarge = result.breakpoints[query];
        }
      }
    })
  }

}
