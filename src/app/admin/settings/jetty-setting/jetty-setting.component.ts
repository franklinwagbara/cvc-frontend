import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { IJetty } from '../../../../../src/app/shared/interfaces/IJetty';
import { FormDialogComponent, FormKeysProp } from '../../../../../src/app/shared/reusable-components/form-dialog/form-dialog.component';
import { JettyService } from '../../../../../src/app/shared/services/jetty.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';

@Component({
  selector: 'app-jetty-setting',
  templateUrl: './jetty-setting.component.html',
  styleUrls: ['./jetty-setting.component.css']
})
export class JettySettingComponent implements OnInit {
  jettyData: IJetty[];
  jettyKeysMappedToHeaders = {
    id: 'Id',
    name: 'Name'
  }

  constructor(
    private dialog: MatDialog,
    private jettyService: JettyService,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.getAllJetty();
  }

  getAllJetty(): void {
    this.jettyService.getAllJetty().subscribe({
      next: (res: any) => {
        this.jettyData = res?.data;
        this.spinner.close();
        this.progressBar.close();
      },
      error: (error: unknown) => {
        console.log(error);
        this.snackBar.open('Something went wrong while fetching jetty', null, { panelClass: ['error']});
        this.spinner.close();
        this.progressBar.close();
      }
    })
  }

  addData(data?: any): void {
    const formData: FormKeysProp = {name: {validator: [Validators.required], value: data?.name || ''}}
    const dialogRef = this.dialog.open(FormDialogComponent, { 
      data: { title: 'New Jetty', formData, formType: 'Create' },
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.progressBar.open();
        this.jettyService.createJetty(result).subscribe({
          next: (val: any) => {
            this.progressBar.close();
            if (!val.success) {
              this.snackBar.open('Failed to create Jetty. Please try again.', null, { panelClass: ['error']});
              return;
            }
            this.progressBar.open();
            this.getAllJetty();
            this.snackBar.open('Jetty created successfully', null, { panelClass: ['success']});
          },
          error: (error: unknown) => {
            console.log(error);
            this.snackBar.open('Something went wrong while creating jetty', null, { panelClass: ['error']});
            this.progressBar.close();
            this.addData(result);
          }
        })
      }
    })
  }

  editData(value: any): void {
    const formData: FormKeysProp = {id: {value: value.id, disabled: true }, name: {validator: [Validators.required], value: value.name }}
    const dialogRef = this.dialog.open(FormDialogComponent, {data: { title: 'Edit Jetty', formData, formType: 'Edit'} });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.progressBar.open();
        this.jettyService.editJetty(result).subscribe({
          next: (val: any) => {
            this.progressBar.close();
            if (!val.success) {
              this.snackBar.open('Failed to edit Jetty.', null, { panelClass: ['error']});
              return;
            }
            this.progressBar.open();
            this.getAllJetty();
            this.snackBar.open('Jetty edited successfully', null, { panelClass: ['success']});
          },
          error: (error: unknown) => {
            console.log(error);
            this.snackBar.open('Something went wrong while editing jetty', null, { panelClass: ['error']});
            this.progressBar.close();
            this.editData(result);
          }
        })
      }
    })
  }

  deleteData(selected: IJetty[]): void {
    if (selected?.length) {
      forkJoin(selected.map((val) => this.jettyService.deleteJetty(val.id))).subscribe({
        next: (responses: any[]) => {
          responses.forEach((res, i) => {
            if (!res?.success) {
              this.snackBar.open(`Failed to delete jetty with id: ${selected[i].id}`, null, { panelClass: ['error']});
              return;
            }
            this.progressBar.open();
            this.getAllJetty();
            this.snackBar.open(`Jetty with id: ${selected[i].id} deleted successfully`);
          })
        },
        error: (error: unknown) => {
          console.log(error);
          this.snackBar.open('Delete operation could not be processed', null, { panelClass: ['error']});
        }
      })
    }
  }
}
