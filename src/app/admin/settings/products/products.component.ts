import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { ApplicationProcessesService } from '../../../../../src/app/shared/services/application-processes.service';
import { LibaryService } from '../../../../../src/app/shared/services/libary.service';

import { AppFeeFormComponent } from '../../../../../src/app/shared/reusable-components/app-fee-form/app-fee-form.component';
import { ProductFormComponent } from '../../../../../src/app/shared/reusable-components/product-form/product-form.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  // public permitStages: PermitStage[];
  // public branches: IBranch[];
  // public roles: IRole[];
  // public actions: string[];
  //public statuses: string[];
  // public facilityTypes: IFacilityType[];
  public products: any[];
  public products2: any[];
  public productType: any[];

  public tableTitles = {
    branches: 'PRODUCTS',
  };

  public branchKeysMappedToHeaders = {
    //id: 'Id',
    name: 'Name',
    productType: 'Product Type',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBarService: ProgressBarService,
    private adminHttpService: AdminService,
    private spinner: SpinnerService,
    private processFlow: ApplicationProcessesService,
    private libraryService: LibaryService,
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.progressBarService.open();
    this.spinner.open();

    forkJoin([
      this.adminService.getproducts(),
      this.adminHttpService.getproductTypes(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) this.products = res[0].data;
        if (res[1].success) this.productType = res[1].data;

        const idToNameMap = this.productType.reduce((map: any, item: any) => {
          map[item.id] = item.name;
          return map;
        }, {} as any);

        // Replace applicationTypeId with the corresponding name
        this.products2 = res[0].data.map((item) => {
          return {
            ...item,
            applicationTypeId: idToNameMap[item.applicationTypeId],
          };
        });

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
      products: {
        data: {
          productType: this.productType,
        },
        form: ProductFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      //this.progressBarService.open();
      this.ngOnInit();
      this.cd.markForCheck();
    });
  }

  onDeleteData(event: any, type: string) {
    const typeToModelMapper = {
      products: {
        id: 'id',
      },
    };
    const listOfDataToDelete = [...event];
    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'products') {
        return this.adminService.deleteproduct(req[typeToModelMapper[type].id]);
      } else {
        return this.adminService.deleteproduct(req[typeToModelMapper[type].id]);
      }
    });
    this.progressBarService.open();
    forkJoin(requests).subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open(
            `${
              res.length > 1
                ? res.length + ' records '
                : res.length + ' record '
            } deleted successfully.`,
            null,
            {
              panelClass: ['success'],
            }
          );
          this.ngOnInit();
          // const responses = res
          //   .map((r) => r.data.data)
          //   .sort((a, b) => a.length - b.length);
          // if (type === 'branches') this.applicationProcesses = responses[0];
        }
        this.progressBarService.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open('Something went wrong while deleting data!', null, {
          panelClass: ['error'],
        });
        this.progressBarService.close();
        this.cd.markForCheck();
      },
    });
  }

  onEditData(event: any, type: string) {
    const operationConfiguration = {
      products: {
        data: {
          productType: this.productType,
          product: event,
          action: 'EDIT',
        },
        form: ProductFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      //this.progressBarService.open();

      this.ngOnInit();
      //this.progressBarService.close();
      this.cd.markForCheck();
    });
  }
}
