import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { Staff } from 'src/app/admin/settings/all-staff/all-staff.component';
import { AppException } from '../../exceptions/AppException';
import { AdminService } from '../../services/admin.service';
import { ProgressBarService } from '../../services/progress-bar.service';
import { GenericService } from '../../services';
import { IApplication } from '../../interfaces/IApplication';
import { UserRole } from '../../constants/userRole';

@Component({
  selector: 'app-assign-application-form',
  templateUrl: './assign-application-form.component.html',
  styleUrls: ['./assign-application-form.component.css'],
})
export class AssignApplicationFormComponent
  implements OnInit, AfterViewChecked
{
  public form: FormGroup;
  public appsOnStaffDesk: IApplication[] = [];
  public staffs: StaffWithName[];
  public staff: StaffWithName;
  public routableStaffs: StaffWithName[];
  public selectedStaffs = [];
  public staffsDropdownSettings: IDropdownSettings = {};
  private selectedApplications: IApplication[];

  tableTitles = {
    applications: "Applications on Staff's Desk",
  };

  userKeysMappedToHeaders = {
    appReference: 'Reference',
    permitType: 'Permit Type',
    companyName: 'Comany Name',
    submittedDate: 'Submission Date',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssignApplicationFormComponent>,
    private snackBar: MatSnackBar,
    private adminServe: AdminService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private cd: ChangeDetectorRef,
    private gen: GenericService
  ) {
    this.staffs = data.data.staffs.filter(
      (s: StaffWithName) => s.role == UserRole.Head
    );

    this.staffs = this.staffs.map((s: StaffWithName) => {
      s.name = `${s.lastName}, ${s.firstName} (${s.email})`;
      return s;
    });

    this.appsOnStaffDesk = data.data.applications;

    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.staffsDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      limitSelection: 1,
      allowSearchFilter: true,
    };

    // this.getStaffsForRerouteApplication();
  }

  // getStaffsForRerouteApplication() {
  //   this.progressBar.open();
  //   this.adminServe.getStaffsForRerouteApplication(this.staff.id).subscribe({
  //     //todo: change id
  //     next: (res) => {
  //       this.staffs = res.data.data;

  //       this.progressBar.close();
  //     },
  //     error: (error) => {
  //       this.progressBar.close();
  //     },
  //   });
  // }

  onSelectApp(apps: IApplication[]) {
    console.log(this.form.value);
    this.selectedApplications = apps;
  }

  onClose() {
    this.dialogRef.close();
  }

  assignApplication() {
    this.progressBar.open();

    const model = {
      newStaffId: this.form.get('id').value[0].id,
      oldStaffId: null,
      comment: this.form.get('comment').value,
      apps: [...this.selectedApplications.map((app) => app.id)],
    };

    this.adminServe.assignApplication(model).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open(
            'Permit Stage document was created successfull!',
            null,
            {
              panelClass: ['success'],
            }
          );

          this.dialogRef.close();
        }

        this.progressBar.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.snackBar.open(error.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
        this.cd.markForCheck();
      },
    });
  }

  onItemSelect(event: ListItem) {
    (this.form.get('id') as FormArray).push(new FormControl(event.id));
  }

  onSelectAll(event: ListItem[]) {
    event.forEach((item) => {
      (this.form.get('id') as FormArray).push(new FormControl(item.id));
    });
  }

  onDeSelect(event: ListItem) {
    const targetIndex = (
      (this.form.get('id') as FormArray).value as Array<number>
    ).indexOf(event.id as number);
    (this.form.get('id') as FormArray).removeAt(targetIndex);
  }
}

interface StaffWithName extends Staff {
  name: string;
}
