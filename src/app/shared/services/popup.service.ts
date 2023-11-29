import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(public snackBar: MatSnackBar) {}

  public open(message: string, type: 'error' | 'success') {
    this.snackBar.open(message, null, {
      panelClass: [type],
    });
  }
}
