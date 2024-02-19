import { Component, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-recipients-view',
  templateUrl: './recipients-view.component.html',
  styleUrls: ['./recipients-view.component.css']
})
export class RecipientsViewComponent {
  vessels: any[];

  recipientKeysMappedToHeaders = {
    imoNumber: 'IMO Number',
    vesselName: 'Vessel Name',
    offtakeVolume: 'Offtake Volume',
    product: 'Product'
  }

  constructor(
    private dialogRef: MatDialogRef<RecipientsViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vessels: any[] },
  ) {
    this.vessels = data.vessels;
  }

  close(): void {
    this.dialogRef.close();
  }
}
