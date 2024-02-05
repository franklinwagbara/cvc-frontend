import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import {
  FormDialogComponent,
  FormKeysProp,
} from '../../../shared/reusable-components/form-dialog/form-dialog.component';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { IDipMethod } from '../../processing-plant/coq-application-form/coq-application-pp-form.component';
import { DipMethodService } from 'src/app/shared/services/dip-method/dip-method.service';

@Component({
  selector: 'app-dip-method-setting',
  templateUrl: './dip-method-setting.component.html',
  styleUrls: ['./dip-method-setting.component.css'],
})
export class DipMethodSettingComponent implements OnInit {
  dipMethods: IDipMethod[] = null;
  dipMethodKeysMappedToHeaders = {
    id: 'Id',
    name: 'Name',
  };

  constructor(
    private dialog: MatDialog,
    private dipMethodService: DipMethodService,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.getDipMethods();
  }

  getDipMethods(): void {
    this.dipMethodService.getAll().subscribe({
      next: (res: any) => {
        this.dipMethods = res?.data;
        this.spinner.close();
        this.progressBar.close();
      },
      error: (error: unknown) => {
        console.log(error);
        this.snackBar.open(
          'Something went wrong while fetching dip methods',
          null,
          {
            panelClass: ['error'],
          }
        );
        this.spinner.close();
        this.progressBar.close();
      },
    });
  }

  addData(data?: any): void {
    const formData: FormKeysProp = {
      name: { validator: [Validators.required], value: data?.name || '' },
    };
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: { title: 'New Dip Method', formData, formType: 'Create' },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.progressBar.open();
        this.dipMethodService.postDippingMethod(result).subscribe({
          next: (val: any) => {
            this.progressBar.close();
            if (!val.success) {
              this.snackBar.open(
                'Failed to create Dip Method. Please try again.',
                null,
                { panelClass: ['error'] }
              );
              return;
            }
            this.progressBar.open();
            this.getDipMethods();
            this.snackBar.open('Dip Method created successfully', null, {
              panelClass: ['success'],
            });
          },
          error: (error: unknown) => {
            console.log(error);
            this.snackBar.open(
              'Something went wrong while creating dip method',
              null,
              { panelClass: ['error'] }
            );
            this.progressBar.close();
            this.addData(result);
          },
        });
      }
    });
  }

  editData(value: any): void {
    const formData: FormKeysProp = {
      id: { value: value.id, disabled: true },
      name: { validator: [Validators.required], value: value.name },
    };
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: { title: 'Edit Dip Method', formData, formType: 'Edit' },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.progressBar.open();
        this.dipMethodService.updateDippingMethod(result).subscribe({
          next: (val: any) => {
            this.progressBar.close();
            if (!val.success) {
              this.snackBar.open('Failed to edit Dip Method.', null, {
                panelClass: ['error'],
              });
              return;
            }
            this.progressBar.open();
            this.getDipMethods();
            this.snackBar.open('Dip Method edited successfully', null, {
              panelClass: ['success'],
            });
          },
          error: (error: unknown) => {
            console.log(error);
            this.snackBar.open(
              'Something went wrong while editing Dip Method',
              null,
              { panelClass: ['error'] }
            );
            this.progressBar.close();
            this.editData(result);
          },
        });
      }
    });
  }

  deleteData(selected: IDipMethod[]): void {
    if (selected?.length) {
      forkJoin(
        selected.map((val) => this.dipMethodService.deleteDippingMethod(val.id))
      ).subscribe({
        next: (responses: any[]) => {
          responses.forEach((res, i) => {
            if (!res?.success) {
              this.snackBar.open(
                `Failed to delete dip method with id: ${selected[i].id}`,
                null,
                { panelClass: ['error'] }
              );
              return;
            }
            this.progressBar.open();
            this.getDipMethods();
            this.snackBar.open(
              `Dip method with id: ${selected[i].id} deleted successfully`
            );
          });
        },
        error: (error: unknown) => {
          console.log(error);
          this.snackBar.open('Delete operation could not be processed', null, {
            panelClass: ['error'],
          });
        },
      });
    }
  }
}
