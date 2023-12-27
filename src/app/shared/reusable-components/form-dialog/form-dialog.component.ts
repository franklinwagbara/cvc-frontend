import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';


@Component({
  selector: 'form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.css'],
})
export class FormDialogComponent implements OnInit {
  form: FormGroup;
  formKeys: any[];
  formValues: any[];
  @Input() formKeysProp: FormKeysProp;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<FormDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const formGroup = {};
    this.formKeys = Object.keys(this.formKeysProp);
    this.formValues = Object.values(this.formKeysProp);
    this.formKeys.forEach((key, i) => {
      formGroup[key] = [this.formValues[i]?.value || '', this.formValues[i]?.validator || []]
    })
    this.form = this.fb.group(formGroup);
  }

  onClose(): void {
    this.dialogRef.close(this.form.value);
  }
}

export type FormKeysProp = {[key: string]: { validator?: ValidatorFn | ValidatorFn[], value?: any }};