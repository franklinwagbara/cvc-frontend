import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-coq-form',
  templateUrl: './edit-coq-form.component.html',
  styleUrls: ['./edit-coq-form.component.css']
})
export class EditCoqFormComponent implements OnInit {
  form: FormGroup;
  @Input() isGasProduct = false;

  constructor(
    public dialogRef: MatDialogRef<EditCoqFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) { }

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
}
