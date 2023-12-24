import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.css'],
})
export class FormDialogComponent implements OnInit {
  form: FormGroup;
  formKeys: any[];
  formValues: any[];
  formEntries: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const formGroup = {};
    this.formEntries = Object.entries(this.data.formData);
    this.formKeys = Object.keys(this.data.formData);
    this.formValues = Object.values(this.data.formData);
    this.formKeys.forEach((key, i) => {
      formGroup[key] = [this.formValues[i]?.value || '', this.formValues[i]?.validator || []]
    })
    this.form = this.fb.group(formGroup);

    this.formEntries.forEach((entry) => {
      if (entry[1].disabled) {
        this.form.controls[entry[0]].disable();
      }
    })
  }

  submit(): void {
    this.dialogRef.close(this.form.getRawValue());
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  trackByFn(index: number) {
    return index;
  }
}

type InputType = 'text' | 'number' | 'email' | 'file' | 'checkbox' | 'radio' | 'password';
export type FormKeysProp = {[key: string]: { validator?: ValidatorFn | ValidatorFn[] | null, select?: boolean, inputType?: InputType, value?: any, disabled?: boolean }};