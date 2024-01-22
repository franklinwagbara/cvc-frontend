import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private openState = false;
  public message: string;

  public open(): void {
    this.message = '';
    this.openState = true;
  }

  public show(message: string): void {
    this.openState = true;
    this.message = message;
  }

  public close() {
    this.openState = false;
  }

  public get isOpen() {
    return this.openState;
  }
}
