import { Category } from '../../../../../src/app/admin/settings/modules-setting/modules-setting.component';

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminService } from '../../services/admin.service';
import { ProgressBarService } from '../../services/progress-bar.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent {
  public form: FormGroup;
  public categories: Category[];
  public currentValue: Category;

  constructor(
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private adminHttpService: AdminService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private progressBar: ProgressBarService
  ) {
    this.categories = data.data.categories;
    this.currentValue = data.data?.currentValue;

    this.form = this.formBuilder.group({
      name: [
        this.currentValue ? this.currentValue.name : '',
        Validators.required,
      ],
      code: [
        this.currentValue ? this.currentValue.code : '',
        Validators.required,
      ],
      description: [
        this.currentValue ? this.currentValue.description : '',
        Validators.required,
      ],
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  createCategory() {
    this.progressBar.open();

    this.adminHttpService.createModule(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Category was created successfully!', null, {
            panelClass: ['success'],
          });
          this.dialogRef.close();
        }

        this.progressBar.close();
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not create the Category!',
          null,
          {
            panelClass: ['error'],
          }
        );
        this.progressBar.close();
      },
    });
  }

  editCategory() {
    this.progressBar.open();

    const formValue = this.form.value as any;
    formValue.id = this.currentValue.id;

    this.adminHttpService.editModule(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Category was created successfully!', null, {
            panelClass: ['success'],
          });
          this.dialogRef.close();
        }

        this.progressBar.close();
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not create the Category!',
          null,
          {
            panelClass: ['error'],
          }
        );
        this.progressBar.close();
      },
    });
  }
}
