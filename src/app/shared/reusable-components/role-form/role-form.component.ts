import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarService } from '../../services/progress-bar.service';
import { PopupService } from '../../services/popup.service';
import { AdminService } from '../../services/admin.service';
import { SpinnerService } from '../../services/spinner.service';
import { IRole } from '../../interfaces/IRole';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleFormComponent implements OnInit {
  public form: FormGroup;
  public roles: IRole;
  public isSubmitted = false;
  public isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RoleFormComponent>,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService,
    private popUp: PopupService,
    private adminService: AdminService,
    private spinner: SpinnerService
  ) {
    this.roles = data.data.roles;

    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.data.data.action === 'EDIT') {
      //this.getRole();
      this.form.get('name').setValue(this.roles.name);
      this.form.get('description').setValue(this.roles.description);

      this.cd.markForCheck();
    }
  }

  get f() {
    return this.form.controls;
  }

  // getRole() {
  //   this.adminService.getRoleById(this.data.data.roleId).subscribe({
  //     next: (res) => {
  //       this.roles = res.data;
  //       this.form.get('name').setValue(this.roles.name);
  //       this.form.get('description').setValue(this.roles.description);
  //       this.form.get('normalizedName').setValue(this.roles.normalizedName);
  //       this.form.get('concurrencyStamp').setValue(this.roles.concurrencyStamp);
  //       this.form
  //         .get('userRoles')
  //         .setValue(this.roles.userRoles);
  //       this.cd.markForCheck();
  //     },
  //     error: (err) => {
  //       this.snackBar.open(err?.message, null, {
  //         panelClass: ['error'],
  //       });
  //       this.progressBar.close();
  //     },
  //   });
  // }

  createRole() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.spinner.open();
    this.isLoading = true;
    let formData = this.form.value;
    formData.id = '0';
    this.adminService.addRoles(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.spinner.close();
        this.snackBar.open('Role was created successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
        this.cd.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  EditRole() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.spinner.open();
    this.isLoading = true;
    let formData = this.form.value;
    formData.id = this.roles.id;
    this.adminService.editRoles(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.spinner.close();
        this.snackBar.open('Role was modified successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
        this.cd.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.spinner.close();
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.cd.markForCheck();
      },
    });
  }

  onClose() {}
}
