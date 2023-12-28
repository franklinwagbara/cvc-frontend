import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { INominatedSurveyor } from 'src/app/shared/interfaces/INominatedSurveyor';
import { FormDialogComponent, FormKeysProp } from 'src/app/shared/reusable-components/form-dialog/form-dialog.component';
import { UserFormComponent } from 'src/app/shared/reusable-components/user-form/user-form.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NominatedSurveyorService } from 'src/app/shared/services/nominated-surveyor.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-nominated-surveyor-setting',
  templateUrl: './nominated-surveyor-setting.component.html',
  styleUrls: ['./nominated-surveyor-setting.component.css']
})
export class NominatedSurveyorSettingComponent implements OnInit {
  surveyors: INominatedSurveyor[];
  
  surveyorKeysMappedToHeaders = {
    id: 'ID',
    name: 'Name',
    email: 'Email'
  }

  constructor(
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private nominatedSurveyorService: NominatedSurveyorService,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.spinner.open();

    this.nominatedSurveyorService.getAllNominatedSurveyors().subscribe({
      next: (res: any) => {
        this.surveyors = res?.data;
        this.spinner.close();
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.close();
        this.snackBar.open('Something went wrong while fetching users', null, { panelClass: ['error'] });
      }
    })
  }
  
  addData(): void {
    const formData: FormKeysProp = {
      name: {validator: [Validators.required] },
      email: {validator: null }
    }
    const dialogRef = this.dialog.open(FormDialogComponent, { data: { title: 'New Nominated Surveyor', formData, formType: 'Create' }, disableClose: true});
    dialogRef.afterClosed().subscribe((result: INominatedSurveyor) => {
      if (result) {
        console.log(result);
        this.spinner.open();
        this.nominatedSurveyorService.createNominatedSurveyor(result).subscribe({
          next: () => {
            this.spinner.close();
            this.snackBar.open(`Added Nominated Surveyor successfully`, null, { panelClass: ['success']});
            setTimeout(() => {
              window.location.reload();
            }, 2500);
          },
          error: (error: any) => {
            console.log(error);
            this.spinner.close();
            this.snackBar.open('Something went wrong. Could not add nominated surveyor.', null, { panelClass: ['error'] });
          }
        })
      }
    })
  }

  editData(row: any): void {
    const formData: FormKeysProp = {
      id: {value: row.id, disabled: true }, 
      name: {validator: [Validators.required], value: row.name },
      email: {validator: null, value: row.email }
    }
    const dialogRef = this.dialog.open(FormDialogComponent, { data: { title: 'Edit Nominated Surveyor', formData, formType: 'Edit' }, disableClose: true });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.open();
        this.nominatedSurveyorService.editNominatedSurveyor(result).subscribe({
          next: (res: any) => {
            this.spinner.close();
            this.snackBar.open(`Nominated Surveyor with id: ${result.id} edited successfully`, null, {panelClass: ['success']});
            setTimeout(() => {
              window.location.reload();
            }, 2500);
          },
          error: (error: any) => {
            console.log(error);
            this.spinner.close();
            this.snackBar.open('Something went wrong. Could not edit nominated surveyor.');
          }
        })
      }
    })
  }

  deleteData(selected: any[]): void {
    if (selected?.length) {
      this.spinner.open();
      forkJoin(selected.map((val) => this.nominatedSurveyorService.deleteNominatedSurveyor(val.id))).subscribe({
        next: () => {
          this.spinner.close();
          this.snackBar.open('Selected Nominated Surveyor(s) deleted successfully', null, { panelClass: ['success']}); 
          setTimeout(() => {
            window.location.reload();
          }, 2500);
        },
        error: (error: unknown) => {
          this.spinner.close();
          console.log(error);
          this.snackBar.open('Delete operation could not be processed', null, { panelClass: ['error']});
        }
      })
    }
  }

}
