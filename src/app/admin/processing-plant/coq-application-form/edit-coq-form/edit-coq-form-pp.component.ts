import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-coq-form-pp',
  templateUrl: './edit-coq-form-pp.component.html',
  styleUrls: ['./edit-coq-form-pp.component.css'],
})
export class EditCoqFormPPComponent implements OnInit {
  form: FormGroup;
  isGasProduct = false;

  constructor(
    public dialogRef: MatDialogRef<EditCoqFormPPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.isGasProduct = this.data.isGasProduct;
  }

  ngOnInit(): void {
    this.form = this.fb.group(this.data.form);
  }

  edit(): void {
    this.dialogRef.close(this.form.value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  form: any;
  title: string;
  isGasProduct: boolean;
}
