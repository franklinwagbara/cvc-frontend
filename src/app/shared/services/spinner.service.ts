import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private openState = false;

  public open() {
    this.openState = true;
  }

  public close() {
    this.openState = false;
  }

  public get isOpen() {
    return this.openState;
  }
}
