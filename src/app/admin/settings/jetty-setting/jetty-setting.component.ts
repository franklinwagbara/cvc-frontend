import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { IJetty } from '../../../../../src/app/shared/interfaces/IJetty';
import {
  FormDialogComponent,
  FormKeysProp,
} from '../../../../../src/app/shared/reusable-components/form-dialog/form-dialog.component';
import { JettyService } from '../../../../../src/app/shared/services/jetty.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { IJettyGroup } from 'src/app/shared/interfaces/IJettyGroup';
import { PopupService } from 'src/app/shared/services/popup.service';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { IState } from 'src/app/shared/interfaces/IState';

@Component({
  selector: 'app-jetty-setting',
  templateUrl: './jetty-setting.component.html',
  styleUrls: ['./jetty-setting.component.css'],
})
export class JettySettingComponent implements OnInit {
  jettyGroupings: IJettyGroup[];
  jetties: IJetty[];
  states: IState[];

  jettyKeysMappedToHeaders = {
    name: 'Name (Location)',
    state: 'State',
  };

  constructor(
    private dialog: MatDialog,
    private jettyService: JettyService,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService,
    private popUp: PopupService,
    private library: LibaryService,
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.fetchAllData();
  }

  getAllJetty(): void {
    this.jettyService.getAllJetty().subscribe({
      next: (res: any) => {
        this.jettyGroupings = res?.data;
        this.jetties = [];
        this.jettyGroupings.forEach((grp) => {
          let jetties = grp?.jetties;
          const state = this.states.find(
            (s) => s.name.toLowerCase() === grp.groupName.toLowerCase()
          )?.id;
          if (jetties?.length) {
            jetties = jetties.map((el) => ({...el, state}));
            this.jetties.push(...jetties);
          }
        })
        this.spinner.close();
        this.progressBar.close();
      },
      error: (error: unknown) => {
        console.error(error);
        this.popUp.open('Something went wrong while fetching jetty', 'error');
        this.spinner.close();
        this.progressBar.close();
      },
    });
  }

  fetchAllData(): void {
    forkJoin([
      this.jettyService.getAllJetty(),
      this.library.getStates()
    ]).subscribe({
      next: (res: any[]) => {
        this.jettyGroupings = res[0]?.data;
        this.states = res[1]?.data;
        this.jetties = [];
        this.jettyGroupings.forEach((grp) => {
          let jetties = grp?.jetties;
          const state = this.states.find(
            (s) => s.name.toLowerCase() === grp.groupName.toLowerCase()
          )?.id;
          if (jetties?.length) {
            jetties = jetties.map((el) => ({...el, state}));
            this.jetties.push(...jetties);
          }
        });
        this.spinner.close();
        this.progressBar.close();
      },
      error: (error: unknown) => {
        console.error(error);
        this.popUp.open('Something went wrong while fetching page data', 'error');
        this.spinner.close();
        this.progressBar.close();
      },
    })
  }

  addData(data?: any): void {
    const formData: FormKeysProp = {
      name: { 
        validator: [Validators.required], 
        value: data?.name || '', 
        placeholder: 'Jetty Name', 
      },
      state: { 
        validator: [Validators.required], 
        value: data?.state || '', 
        select: true, 
        selectData: this.states, 
        placeholder: 'Jetty State' 
      },
      location: {
        validator: [Validators.required],
        value: data?.location || '', 
        placeholder: 'Jetty Location' 
      },
    };

    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: { title: 'New Jetty', formData, formType: 'Create' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const { state, name, location } = result;
        const model = { stateId: state, name, location };
        this.progressBar.open();
        this.jettyService.createJetty(model).subscribe({
          next: (val: any) => {
            this.progressBar.close();
            if (!val.success) {
              this.popUp.open(
                'Failed to create Jetty. Please try again.',
                'error'
              );
              return;
            }
            this.progressBar.open();
            this.getAllJetty();
            this.popUp.open('Jetty created successfully', 'success');
          },
          error: (error: unknown) => {
            console.log(error);
            this.popUp.open(
              'Something went wrong while creating jetty',
              'error'
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
      name: { 
        validator: [Validators.required], 
        value: value.name,
        placeholder: 'Jetty Name'
      },
      state: { 
        validator: [Validators.required],
        value: value.state,
        select: true,
        selectData: this.states,
        placeholder: 'Jetty State'
      },
      location: {
        validator: [Validators.required],
        value: value.location,
        placeholder: 'Jetty Location'
      },
    };

    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: { title: 'Edit Jetty', formData, formType: 'Edit' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const { state, name, location } = result;
        const model = { id: value.id, stateId: state, name, location };
        this.progressBar.open();
        this.jettyService.editJetty(model).subscribe({
          next: (val: any) => {
            this.progressBar.close();
            if (!val.success) {
              this.popUp.open('Failed to edit Jetty.', 'error');
              return;
            }
            this.progressBar.open();
            this.getAllJetty();
            this.popUp.open('Jetty edited successfully', 'success');
          },
          error: (error: unknown) => {
            console.error(error);
            this.popUp.open(
              'Something went wrong while editing jetty',
              'error'
            );
            this.progressBar.close();
            this.editData(result);
          },
        });
      }
    });
  }

  deleteData(selected: IJetty[]): void {
    if (selected?.length) {
      forkJoin(
        selected.map((val) => this.jettyService.deleteJetty(val.id))
      ).subscribe({
        next: (responses: any[]) => {
          responses.forEach((res, i) => {
            if (!res?.success) {
              this.popUp.open(
                `Failed to delete jetty with id: ${selected[i].id}`,
                'error'
              );
              return;
            }
            this.progressBar.open();
            this.getAllJetty();
            this.popUp.open(
              `Jetty with id: ${selected[i].id} deleted successfully`, 'success'
            );
          });
        },
        error: (error: unknown) => {
          console.error(error);
          this.popUp.open('Delete operation could not be processed', 'error');
        },
      });
    }
  }
}
