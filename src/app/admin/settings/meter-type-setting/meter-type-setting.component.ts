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
import { MeterTypeService } from 'src/app/shared/services/meter-type/meter-type.service';
import { IMeterType } from 'src/app/admin/processing-plant/coq-application-form/coq-application-pp-form.component';

@Component({
  selector: 'app-meter-type-setting',
  templateUrl: './meter-type-setting.component.html',
  styleUrls: ['./meter-type-setting.component.css'],
})
export class MeterTypeSettingComponent implements OnInit {
  meterTypes: IMeterType[] = null;
  meterTypeKeysMappedToHeaders = {
    id: 'Id',
    name: 'Name',
  };

  constructor(
    private dialog: MatDialog,
    private meterTypeService: MeterTypeService,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.getAllMeterTypes();
  }

  getAllMeterTypes(): void {
    this.meterTypeService.getAll().subscribe({
      next: (res: any) => {
        this.meterTypes = res?.data;
        this.spinner.close();
        this.progressBar.close();
      },
      error: (error: unknown) => {
        console.log(error);
        this.snackBar.open(
          'Something went wrong while fetching meter types',
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
      data: { title: 'New Meter Type', formData, formType: 'Create' },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.progressBar.open();
        this.meterTypeService.postMeterType(result).subscribe({
          next: (val: any) => {
            this.progressBar.close();
            if (!val.success) {
              this.snackBar.open(
                'Failed to create Meter Type. Please try again.',
                null,
                { panelClass: ['error'] }
              );
              return;
            }
            this.progressBar.open();
            this.getAllMeterTypes();
            this.snackBar.open('Meter Type created successfully', null, {
              panelClass: ['success'],
            });
          },
          error: (error: unknown) => {
            console.log(error);
            this.snackBar.open(
              'Something went wrong while creating meter type',
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
      data: { title: 'Edit Meter Type', formData, formType: 'Edit' },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.progressBar.open();
        this.meterTypeService.updateMeterType(result).subscribe({
          next: (val: any) => {
            this.progressBar.close();
            if (!val.success) {
              this.snackBar.open('Failed to edit Meter Type.', null, {
                panelClass: ['error'],
              });
              return;
            }
            this.progressBar.open();
            this.getAllMeterTypes();
            this.snackBar.open('Meter Type edited successfully', null, {
              panelClass: ['success'],
            });
          },
          error: (error: unknown) => {
            console.log(error);
            this.snackBar.open(
              'Something went wrong while editing Meter Type',
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

  deleteData(selected: IMeterType[]): void {
    if (selected?.length) {
      forkJoin(
        selected.map((val) => this.meterTypeService.deleteMeterType(val.id))
      ).subscribe({
        next: (responses: any[]) => {
          responses.forEach((res, i) => {
            if (!res?.success) {
              this.snackBar.open(
                `Failed to delete Meter Type with id: ${selected[i].id}`,
                null,
                { panelClass: ['error'] }
              );
              return;
            }
            this.progressBar.open();
            this.getAllMeterTypes();
            this.snackBar.open(
              `Meter Type with id: ${selected[i].id} deleted successfully`
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
