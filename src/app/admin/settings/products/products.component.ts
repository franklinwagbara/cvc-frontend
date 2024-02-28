import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { ProductFormComponent } from '../../../../../src/app/shared/reusable-components/product-form/product-form.component';
import { PopupService } from 'src/app/shared/services/popup.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
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
    revenueCode: 'Revenue Code'
  };

  constructor(
    public dialog: MatDialog,
    public popUp: PopupService,
    private progressBarService: ProgressBarService,
    private adminHttpService: AdminService,
    private spinner: SpinnerService,
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
        console.error(error);
        this.popUp.open(
          'Something went wrong while retrieving data.',
          'error'
        );

        this.spinner.close();
      },
    });
  }

  onAddData(type: string) {
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

    dialogRef.afterClosed().subscribe((res: 'submitted') => {
      if (res) {
        this.ngOnInit();
        this.cd.markForCheck();
      }
    });
  }

  onDeleteData(event: any, type: string) {
    const typeToModelMapper = {
      products: {
        id: 'id',
      },
    };
    const listOfDataToDelete = [...event];
    const requests = listOfDataToDelete.map((req) => {
      return this.adminService.deleteproduct(req[typeToModelMapper[type].id]);
    });
    this.progressBarService.open();
    forkJoin(requests).subscribe({
      next: (res) => {
        if (res) {
          this.popUp.open(
            `${
              res.length > 1
                ? res.length + ' records '
                : res.length + ' record '
            } deleted successfully.`,
            'success'
          );
          this.ngOnInit();
        }
        this.progressBarService.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.error(error);
        this.popUp.open('Something went wrong while deleting data!', 'error');
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

    dialogRef.afterClosed().subscribe((res: 'submitted') => {
      if (res) {
        this.ngOnInit();
        this.cd.markForCheck();
      }
    });
  }
}
