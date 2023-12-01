import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Staff } from 'src/app/admin/settings/all-staff/all-staff.component';
import { convertTimeToMilliseconds } from 'src/app/helpers/convertTimeToMilliseconds';
import { AuthenticationService } from '../../services';
import { ProgressBarService } from '../../services/progress-bar.service';
import { IApplication } from '../../interfaces/IApplication';
import { ApplyService } from '../../services/apply.service';
import { AdminService } from '../../services/admin.service';
import { ISchedule } from '../../interfaces/ISchedule';
import { ScheduleService } from '../../services/schedule.service';
import { SpinnerService } from '../../services/spinner.service';
import { LibaryService } from '../../services/libary.service';

const TypesOfAppointment = ['Inspection', 'Meeting', 'Preparation'];
const Venue = ['Application field location', 'Authority Office'];

@Component({
  selector: 'app-add-schedule-form',
  templateUrl: './add-schedule-form.component.html',
  styleUrls: ['./add-schedule-form.component.css'],
})
export class AddScheduleFormComponent implements OnInit {
  public form: FormGroup;
  public application: IApplication;
  public schedule: ISchedule;
  public currentUser: Staff;
  public typeOfAppointment = [...TypesOfAppointment];
  public venues = [...Venue];
  public selected: Date | null;
  public time: string | null;
  public staffs: any[];

  constructor(
    public dialogRef: MatDialogRef<AddScheduleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    private auth: AuthenticationService,
    private spinner: SpinnerService,
    private libService: LibaryService,
    private cd: ChangeDetectorRef
  ) {
    this.application = data.data.application;
    this.schedule = data.data?.schedule;

    if (this.schedule) {
      this.form = this.formBuilder.group({
        selectedDate: [
          new Date(this.schedule?.inspectionDate),
          Validators.required,
        ],
        time: [this.schedule.time, Validators.required],
        typeOfAppoinment: [this.schedule.scheduleType, Validators.required],
        venue: [this.schedule.venue, Validators.required],
        comment: [this.schedule.scheduleMessage, Validators.required],
        nominatedStaffId: [this.schedule.nominatedStaffId, Validators.required],
      });
    } else
      this.form = this.formBuilder.group({
        // applicationId: [this.application.id, Validators.required],
        // scheduleBy: [this.currentUser.userId, Validators.required],
        selectedDate: ['', Validators.required],
        time: ['', Validators.required],
        typeOfAppoinment: ['', Validators.required],
        venue: ['', Validators.required],
        comment: ['', Validators.required],
        nominatedStaffId: ['', Validators.required],
      });

    // if (this.schedule) {
    //   this.form = this.formBuilder.group({
    //     selectedDate: [
    //       new Date(this.schedule.scheduleDate),
    //       Validators.required,
    //     ],
    //     time: [this.schedule.time, Validators.required],
    //     typeOfAppoinment: [this.schedule.typeOfAppoinment, Validators.required],
    //     venue: [this.schedule.venue, Validators.required],
    //     comment: [this.schedule.comment, Validators.required],
    //   });
    // } else
    //   this.form = this.formBuilder.group({
    //     // applicationId: [this.application.id, Validators.required],
    //     // scheduleBy: [this.currentUser.userId, Validators.required],
    //     selectedDate: ['', Validators.required],
    //     time: ['', Validators.required],
    //     typeOfAppoinment: ['', Validators.required],
    //     venue: ['', Validators.required],
    //     comment: ['', Validators.required],
    //   });
  }
  ngOnInit(): void {
    const tempUser = this.auth.currentUser;
    this.spinner.open();

    this.auth.getAllStaff().subscribe({
      next: (res) => {
        this.currentUser = res.data.find((u) => u.email === tempUser.userId);

        this.spinner.close();
      },

      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not user information!',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.spinner.close();
      },
    });

    this.currentUser = this.auth.currentUser;

    this.getStaffsForNomination();
  }

  onClose() {
    this.dialogRef.close();
  }

  public get isSupervisor() {
    return (this.currentUser as any).userRoles === 'Supervisor';
  }

  getStaffsForNomination() {
    this.spinner.open();
    this.libService.getStaffsForNomination().subscribe({
      next: (res) => {
        this.staffs = res.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open(error?.message, null, {
          panelClass: ['error'],
        });
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  addSchedule() {
    this.spinner.open();

    this.selected = new Date(this.form.get('selectedDate').value);

    const dateToTime = this.selected.getTime();

    this.selected.setTime(
      dateToTime + convertTimeToMilliseconds(this.form.get('time').value)
    );

    this.form.get('selectedDate').setValue(this.selected);

    const model = {
      id: 0,
      applicationId: this.application.id,
      scheduleType: this.form.controls['typeOfAppoinment'].value,
      scheduledDate: this.form.controls['selectedDate'].value,
      scheduleMessage: this.form.controls['comment'].value,
      nominatedStaffId: this.form.controls['nominatedStaffId'].value,
      // approvalMessage: this.form.controls['comment'].value,
      // venue: this.form.controls['venue'].value,
      // scheduleBy: this.currentUser.id,
    };

    this.scheduleService.addSchedule(model).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Operation was successfully!', null, {
            panelClass: ['success'],
          });

          this.dialogRef.close();
        }

        this.spinner.close();
      },

      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not perform operation!',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.spinner.close();
      },
    });
  }

  editSchedule() {
    this.spinner.open();

    this.selected = new Date(this.form.get('selectedDate').value);

    const dateToTime = this.selected.getTime();

    this.selected.setTime(
      dateToTime + convertTimeToMilliseconds(this.form.get('time').value)
    );

    this.form.get('selectedDate').setValue(this.selected);

    const model = {
      id: this.schedule.id,
      applicationId: this.application.id,
      scheduleType: this.form.controls['typeOfAppoinment'].value,
      scheduledDate: this.form.controls['selectedDate'].value,
      scheduleMessage: this.form.controls['comment'].value,
      nominatedStaffId: this.form.controls['nominatedStaffId'].value,

      // typeOfAppoinment: this.form.controls['typeOfAppoinment'].value,
      // venue: this.form.controls['venue'].value,
      // comment: this.form.controls['comment'].value,
      // inspectionDate: this.form.controls['selectedDate'].value,
      // scheduleBy: this.currentUser.id,
    };

    this.scheduleService.addSchedule(model).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Operation was successfully!', null, {
            panelClass: ['success'],
          });

          this.dialogRef.close();
        }

        this.spinner.close();
      },

      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not perform operation!',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.spinner.close();
      },
    });
  }

  approveSchedule() {
    this.spinner.open();

    this.selected = new Date(this.form.get('selectedDate').value);

    const dateToTime = this.selected.getTime();

    this.selected.setTime(
      dateToTime + convertTimeToMilliseconds(this.form.get('time').value)
    );

    this.form.get('selectedDate').setValue(this.selected);

    const model = {
      id: this.schedule.id,
      applicationId: this.application.id,
      scheduleType: this.form.controls['typeOfAppoinment'].value,
      scheduledDate: this.form.controls['selectedDate'].value,
      scheduleMessage: this.form.controls['comment'].value,
      nominatedStaffId: this.form.controls['nominatedStaffId'].value,

      // typeOfAppoinment: this.form.controls['typeOfAppoinment'].value,
      // venue: this.form.controls['venue'].value,
      // comment: this.form.controls['comment'].value,
      // inspectionDate: this.form.controls['selectedDate'].value,
      // scheduleBy: this.currentUser.id,
    };

    this.scheduleService.addSchedule(model).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Operation was successfully!', null, {
            panelClass: ['success'],
          });

          this.dialogRef.close();
        }

        this.spinner.close();
      },

      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not perform operation!',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.spinner.close();
      },
    });
  }

  updateFormDate(value) {
    this.form.get('selectedDate').setValue(value);
  }
}

export interface Schedule {
  id: number;
  applicationId: number;
  contactPerson?: string;
  contactPhone?: string;
  venue?: string;
  // scheduleBy: string;
  // inspectionDate: string;
  // comment: string;
  // typeOfAppoinment: string;

  scheduleType: string;
  scheduledDate: string;
  scheduleMessage: string;
  approvalMessage?: string;
  isAccepted?: boolean;
  clientMessage?: string;
  contactName?: string;
  phoneNo?: string;
  expiryDate?: string;
  act?: string;
}
