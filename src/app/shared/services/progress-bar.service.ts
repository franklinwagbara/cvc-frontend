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
    this.progressBar.next(true);
  }

  public close() {
    this.progressBar.next(false);
  }
}
