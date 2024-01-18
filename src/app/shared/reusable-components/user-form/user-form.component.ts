import { Component, Inject, OnInit } from '@angular/core';
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

import {
  ILocation,
  Staff,
} from '../../../../../src/app/admin/settings/all-staff/all-staff.component';
import { FieldOffice } from '../../../../../src/app/admin/settings/field-zonal-office/field-zonal-office.component';
import { ProgressBarService } from '../../services/progress-bar.service';
import { AdminService } from '../../services/admin.service';
import { IBranch } from '../../interfaces/IBranch';
import { UserRole } from '../../constants/userRole';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  public form: FormGroup;
  public usersFromCvc: StaffWithName[];
  public userTypes = [''];
  public offices: FieldOffice[];
  // public branches: IBranch[];
  public roles: any;
  public locations: ILocation[];
  public currentValue: Staff | null;
  public usersFromElps: StaffWithName[];
  public file: File | null = null;
  public selectedUserFromElps: StaffWithName;
  public usersDropdownSettings: IDropdownSettings = {};
  public closeDropdownSelection = false;
  public selectedRole: any;
  public isLoading = false;

  public requiredSignatureRoles = [
    UserRole.APPROVER,
    UserRole.CONTROLLER,
    UserRole.FIELDOFFICER,
    // UserRole.SUPERVISOR,
    // UserRole.REVIEWER,
    // UserRole.FAD,
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UserFormComponent>,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private progressBar: ProgressBarService
  ) {
    this.usersFromCvc = data.data.users;
    this.offices = data.data.offices;
    // this.branches = data.data.branches;
    this.roles = data.data.roles;
    this.locations = data.data.locations;
    this.usersFromElps = data.data.staffList;
    this.currentValue = data.data?.currentValue;
    let currentUserId: string;

    //Appending an additional name field to allow interfacing with the ngmultiple-select textField
    this.usersFromElps = this.usersFromElps?.map((user) => {
      user.name = `${user?.lastName}, ${user?.firstName} (${user?.email})`;
      if (this.currentValue && user.email === this.currentValue.email)
        currentUserId = user.id;
      return user;
    });

    this.selectedUserFromElps = this.usersFromElps[0];

    this.form = this.formBuilder.group({
      elpsId: [
        { value: this.currentValue ? currentUserId : '', disabled: true },
        Validators.required,
      ],
      id: [
        {
          value: this.currentValue ? this.currentValue.id : '0',
          disabled: true,
        },
        Validators.required,
      ],
      firstName: [
        {
          value: this.currentValue ? this.currentValue.firstName : '',
          disabled: true,
        },
      ],
      lastName: [
        {
          value: this.currentValue ? this.currentValue.lastName : '',
          disabled: true,
        },
      ],
      email: [
        {
          value: this.currentValue ? this.currentValue.email : '',
          disabled: true,
        },
        Validators.required,
      ],
      phone: [
        {
          value: this.currentValue ? this.currentValue.phoneNo : '',
          disabled: true,
        },
      ],
      userType: [this.currentValue ? this.currentValue.userType : ''],
      roleId: ['', Validators.required],

      locationId: [this.currentValue ? this.currentValue.locationId : ''],

      officeId: [this.currentValue ? this.currentValue.officeId : ''],

      // branchId: [this.currentValue ? this.currentValue.branchId : ''],
      isActive: [
        this.currentValue ? this.currentValue.status : '',
        Validators.required,
      ],

      signatureFile: [this.currentValue ? this.currentValue.signatureFile : ''],
    });
  }

  ngOnInit(): void {
    this.usersDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      limitSelection: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: this.closeDropdownSelection,
    };
  }

  onRoleChanges() {
    this.selectedRole = this.form.get('roleId').value;
    return this.requiredSignatureRoles.includes(this.selectedRole?.name);
  }

  createUser() {
    this.form.controls['elpsId'].setValue(this.selectedUserFromElps.id);
    this.progressBar.open();
    this.isLoading = true;
    const formDataToSubmit = new FormData();

    formDataToSubmit.append('id', '0');
    formDataToSubmit.append('elpsId', this.form.get('elpsId').value);
    formDataToSubmit.append('firstName', this.form.get('firstName').value);
    formDataToSubmit.append('lastName', this.form.get('lastName').value);
    formDataToSubmit.append('email', this.form.get('email').value);
    formDataToSubmit.append('phone', this.form.get('phone').value);
    formDataToSubmit.append('userType', this.form.get('userType').value);
    formDataToSubmit.append('roleId', this.selectedRole?.id);
    formDataToSubmit.append('locationId', this.form.get('locationId').value);
    formDataToSubmit.append('officeId', this.form.get('officeId').value);
    formDataToSubmit.append('isActive', this.form.get('isActive').value);
    formDataToSubmit.append('signatureFile', this.file);

    this.adminService.createStaff(formDataToSubmit).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Staff was created successfully!', null, {
            panelClass: ['success'],
          });
          this.isLoading = false;
          this.dialogRef.close();
        }
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not create the Staff account.' + error,
          null,
          {
            panelClass: ['error'],
          }
        );
        this.isLoading = false;
        this.progressBar.close();
      },
    });
  }

  updateUser() {
    this.progressBar.open();
    this.isLoading = true;
    this.form.controls['elpsId'].setValue(this.selectedUserFromElps.id);

    const formDataToSubmit = new FormData();

    const formKeys = [
      'id',
      'firstName',
      'lastName',
      'email',
      'phone',
      'userType',
      'isActive',
    ];
    formKeys.forEach((key) => {
      formDataToSubmit.append(key, this.form.get(key).value);
    });
    formDataToSubmit.append('signatureFile', this.file);
    formDataToSubmit.append('roleId', this.selectedRole.id);

    this.adminService.updateStaff(formDataToSubmit).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Staff was updated successfully!', null, {
            panelClass: ['success'],
          });
          this.isLoading = false;
          this.dialogRef.close();
        }
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not update the Staff account.',
          null,
          {
            panelClass: ['error'],
          }
        );
        this.isLoading = false;
        this.progressBar.close();
      },
    });
  }

  // onClose() {
  //   console.log(this.form);
  // }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  onItemSelect(event: ListItem) {
    this.selectedUserFromElps = this.usersFromElps.find(
      (u) => u.id === event.id
    );

    this.setFormValues(this.selectedUserFromElps);
  }

  onSelectAll(event: ListItem[]) {
    event.forEach((item) => {
      (this.form.get('docId') as FormArray).push(new FormControl(item.id));
    });
  }

  toggleCloseDropdownSelection() {
    this.closeDropdownSelection = !this.closeDropdownSelection;
    this.usersDropdownSettings = {
      ...this.usersDropdownSettings,
      closeDropDownOnSelection: this.closeDropdownSelection,
    };
  }

  onDeSelect(event: ListItem) {
    const targetIndex = (
      (this.form.get('docId') as FormArray).value as Array<number>
    ).indexOf(event.id as number);
    (this.form.get('docId') as FormArray).removeAt(targetIndex);
  }

  setFormValues(user: StaffWithName) {
    this.form.controls['firstName'].setValue(user.firstName);
    this.form.controls['lastName'].setValue(user.lastName);
    this.form.controls['email'].setValue(user.email);
    this.form.controls['phone'].setValue(user.phoneNo);
    this.form.controls['userType'].setValue('Staff');
    // this.form.controls['locationId'].setValue(user.locationId);
    // this.form.controls['locationId'].setValue(user.locationId);
  }
}

interface StaffWithName extends Staff {
  name: string;
}
