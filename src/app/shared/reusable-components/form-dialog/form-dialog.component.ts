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
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData,
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
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  selectedValue(formKey: string, selectValue: number): any {
    return this.data.formData[formKey]?.selectData.find((d: any) => d.id === selectValue)?.name;
  }

  trackByFn(index: number) {
    return index;
  }
}

type InputType = 'text' | 'number' | 'email' | 'file' | 'checkbox' | 'radio' | 'password';
type FormDialogData = { title: string, formData: any, formType: 'Create' | 'Edit' };
export type FormKeysProp = {[key: string]: { 
  validator?: ValidatorFn | ValidatorFn[] | null; 
  select?: boolean;
  selectData?: any[]; 
  inputType?: InputType;
  value?: any;
  disabled?: boolean;
  placeholder?: string;
}};