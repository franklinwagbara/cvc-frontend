import { forkJoin } from 'rxjs';
import { FieldOfficeFormComponent } from '../../../../../src/app/shared/reusable-components/field-office-form/field-office-form.component';
import { AuthenticationService } from '../../../../../src/app/shared/services';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ApplyService } from '../../../../../src/app/shared/services/apply.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IBranch } from '../../../../../src/app/shared/interfaces/IBranch';
import { BranchFormComponent } from '../../../../../src/app/shared/reusable-components/branch-form/branch-form.component';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';

@Component({
  selector: 'app-branch-setting',
  templateUrl: './branch-setting.component.html',
  styleUrls: ['./branch-setting.component.css'],
})
export class BranchSettingComponent implements OnInit {
  public branches: IBranch[];
  public form: FormGroup;

  public tableTitles = {
    branches: 'BRANCH SETTINGS',
  };

  public branchKeysMappedToHeaders = {
    name: 'Name',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private applyHttpService: ApplyService,
    private formBuilder: FormBuilder,
    private progressBarService: ProgressBarService,
    private spinner: SpinnerService,
    private adminHttpService: AdminService
  ) {}

  ngOnInit(): void {
    // this.progressBarService.open();
    this.spinner.open();

    forkJoin([this.adminHttpService.getBranches()]).subscribe({
      next: (res) => {
        if (res[0].success) {
          this.branches = res[0].data.data;
        }

        // this.progressBarService.close();
        this.spinner.close();
      },

      error: (error: unknown) => {
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        // this.progressBarService.close();
        this.spinner.close();
      },
    });
  }

  onAddData(event: Event, type: string) {
    const operationConfiguration = {
      branches: {
        data: {},
        form: BranchFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.progressBarService.open();

      this.adminHttpService.getBranches().subscribe((res) => {
        this.branches = res.data.data;

        this.progressBarService.close();
      });
    });
  }

  onDeleteData(event: any, type: string) {
    const typeToModelMapper = {
      branches: {
        name: 'Branch',
        id: 'id',
      },
    };

    const listOfDataToDelete = [...event];

    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'branches') {
        return this.adminHttpService.deleteBranch(
          req[typeToModelMapper[type].id]
        );
      } else {
        return this.adminHttpService.deleteBranch(
          req[typeToModelMapper[type].id]
        );
      }
    });

    this.progressBarService.open();

    forkJoin(requests).subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open(
            `${typeToModelMapper.branches.name} was deleted successfully!`,
            null,
            {
              panelClass: ['success'],
            }
          );

          const responses = res
            .map((r) => r.data.data)
            .sort((a, b) => a.length - b.length);

          if (type === 'branches') this.branches = responses[0];
        }

        this.progressBarService.close();
      },

      error: (error: unknown) => {
        this.snackBar.open('Something went wrong while deleting data!', null, {
          panelClass: ['error'],
        });

        this.progressBarService.close();
      },
    });
  }

  onEditData(event: any, type: string) {
    console.log('Edit not implemented yet');
  }
}
