import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { INominatedSurveyor } from '../../../../../src/app/shared/interfaces/INominatedSurveyor';
import { FormDialogComponent, FormKeysProp } from '../../../../../src/app/shared/reusable-components/form-dialog/form-dialog.component';
import { NominatedSurveyorService } from '../../../../../src/app/shared/services/nominated-surveyor.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';

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
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private nominatedSurveyorService: NominatedSurveyorService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.getAllNominatedSurveyors();
  }
  
  getAllNominatedSurveyors(): void {
    this.nominatedSurveyorService.getAllNominatedSurveyors().subscribe({
      next: (res: any) => {
        this.surveyors = res?.data;
        this.spinner.close();
        this.progressBar.close();
        this.cd.markForCheck();
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.close();
        this.progressBar.close();
        this.snackBar.open('Something went wrong while fetching users', null, { panelClass: ['error'] });
      }
    })
  }
  
  addData(data?: any): void {
    const formData: FormKeysProp = {
      name: {validator: [Validators.required], value: data?.name || '' },
      email: {validator: null, value: data?.email || '' }
    }
    const dialogRef = this.dialog.open(
      FormDialogComponent, 
      { 
        data: { title: 'Add Nominated Surveyor', formData, formType: 'Create' }, 
        width: '400px',
        minHeight: '300px'
      }
    );
    dialogRef.afterClosed().subscribe((result: INominatedSurveyor) => {
      if (result) {
        console.log(result);
        this.progressBar.open();
        this.nominatedSurveyorService.createNominatedSurveyor(result).subscribe({
          next: () => {
            this.progressBar.close();
            this.snackBar.open(`Added Nominated Surveyor successfully`, null, { panelClass: ['success']});
            this.progressBar.open();
            this.getAllNominatedSurveyors();
          },
          error: (error: any) => {
            console.log(error);
            this.progressBar.close();
            this.snackBar.open('Something went wrong. Could not add nominated surveyor.', null, { panelClass: ['error'] });
            this.addData(result);
          }
        })
      }
    })
  }

  editData(row: any): void {
    const formData: FormKeysProp = {
      id: {value: row?.id, disabled: true, }, 
      name: {validator: [Validators.required], value: row?.name },
      email: {validator: null, value: row?.email }
    }
    const dialogRef = this.dialog.open(
      FormDialogComponent, 
      { 
        data: { title: 'Edit Nominated Surveyor', formData, formType: 'Edit' }, 
        width: '400px',
        minHeight: '300px',
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.progressBar.open();
        this.nominatedSurveyorService.editNominatedSurveyor(result).subscribe({
          next: (res: any) => {
            this.progressBar.close();
            this.snackBar.open(
              `Nominated Surveyor with id: ${result.id} edited successfully`, 
              null, {panelClass: ['success']
            });
            this.progressBar.open();
            this.getAllNominatedSurveyors();
          },
          error: (error: any) => {
            console.log(error);
            this.progressBar.close();
            this.snackBar.open('Something went wrong. Could not edit nominated surveyor.');
            this.editData(result);
          }
        })
      }
    })
  }

  deleteData(selected: any[]): void {
    if (selected?.length) {
      this.progressBar.open();
      forkJoin(selected.map((val) => this.nominatedSurveyorService.deleteNominatedSurveyor(val.id))).subscribe({
        next: () => {
          this.progressBar.close();
          this.snackBar.open('Selected Nominated Surveyor(s) deleted successfully', null, { panelClass: ['success']}); 
          this.progressBar.open();
          this.getAllNominatedSurveyors();
        },
        error: (error: unknown) => {
          this.progressBar.close();
          console.log(error);
          this.snackBar.open('Delete operation could not be processed', null, { panelClass: ['error']});
        }
      })
    }
  }

}
