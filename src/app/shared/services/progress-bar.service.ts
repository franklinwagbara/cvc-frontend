import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  public progressBar = new Subject();
  constructor() {
    this.progressBar.next(false);
  }

  public open() {
    // ProgressBarService.open = !ProgressBarService.open;
    this.progressBar.next(true);
    console.log('toggling progress bar');
  }

  public close() {
    this.progressBar.next(false);
    console.log('toggling progress bar');
  }
}
