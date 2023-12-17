import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogData, EditCoqFormComponent } from '../edit-coq-form/edit-coq-form.component';
import { CoQData, LiquidProductData, LocalDataKeys } from '../certificate-of-quantity.component';
import { Util } from 'src/app/shared/lib/Util';
import { CoqFormService } from 'src/app/shared/services/coq-form.service';


@Component({
  selector: 'app-coq-form-preview',
  templateUrl: './coq-form-preview.component.html',
  styleUrls: ['./coq-form-preview.component.css'],
})
export class CoqFormPreviewComponent implements OnInit {
  displayedColumns: string[] = ['tank', 'status', 'dip', 'waterDIP', 'tov', 'waterVOI', 'corr', 'gov', 'temp', 'density', 'vcf', 'gsv', 'mtVAC', 'actions'];
  formData: any[] = [];
  dataSource: MatTableDataSource<any>;

  objNotEmpty = Util.objNotEmpty;

  constructor(
    public dialog: MatDialog,
    public coqForm: CoqFormService,
  ) {}
  
  ngOnInit(): void {
    this.coqForm.liquidProductPreviewData$.subscribe((val: CoQData[]) => {
      this.formData = this.flattenCoQDataArr(val);
      this.dataSource = new MatTableDataSource(this.formData);
    })
    this.dataSource = new MatTableDataSource(this.formData);
  }

  hasMeterCubeUnit(colKey: string) {
    const cols = ['tov', 'corr', 'gov', 'gsv'];
    return cols.includes(colKey);
  }

  hasTempUnit(colKey: string) {
    const cols = ['temp'];
    return cols.includes(colKey);
  }

  hasNoUnit(colKey: string) {
    const colsWithUnit = ['tov', 'corr', 'gov', 'gsv', 'temp'];
    return !colsWithUnit.includes(colKey);
  }

  openEditDialog(data: DialogData): void {
    const dialogRef = this.dialog.open(EditCoqFormComponent, 
      { data, closeOnNavigation: true, width: '400px', height: '400px' });
    dialogRef.afterClosed().subscribe((result: LiquidProductData) => {
      if (result) {
        const { tank, status } = result;
        const localPreviewData = JSON.parse(localStorage.getItem(LocalDataKeys.COQFORMPREVIEWDATA));
        if (Array.isArray(localPreviewData) && localPreviewData.length) {
          for (let i = 0; i < localPreviewData.length; i++) {
            if (localPreviewData[i][status.toLowerCase()].tank === tank && localPreviewData[i][status.toLowerCase()].status === status) {
              localPreviewData[i][status.toLowerCase()] = result;
              // Check if diff data exists and update
              if (Object.keys(localPreviewData[i]['diff']).length) {
                let data: CoQData = localPreviewData[i];
                data.diff = {
                  status: 'DIFF',
                  tank: data.before.tank,
                  dip: parseFloat(data.after.dip) - parseFloat(data.before.dip),
                  waterDIP: parseFloat(data.after.waterDIP) - parseFloat(data.before.waterDIP),
                  tov: parseFloat(data.after.tov) - parseFloat(data.before.tov),
                  waterVOI: parseFloat(data.after.waterVOI) - parseFloat(data.before.waterVOI),
                  corr: parseFloat(data.after.corr) - parseFloat(data.before.corr),
                  gov: parseFloat(data.after.gov) - parseFloat(data.before.gov),
                  temp: parseFloat(data.after.temp) - parseFloat(data.before.temp),
                  density: parseFloat(data.after.density) - parseFloat(data.before.density),
                  vcf: parseFloat(data.after.vcf) - parseFloat(data.before.vcf),
                  gsv: parseFloat(data.after.gsv) - parseFloat(data.before.gsv),
                  mtVAC: parseFloat(data.after.mtVAC) - parseFloat(data.before.mtVAC),
                }
              }
              localStorage.setItem(LocalDataKeys.COQFORMPREVIEWDATA, JSON.stringify(localPreviewData));
              this.coqForm.liquidProductPreviewData = localPreviewData;
              this.coqForm.liquidProductPreviewData$.next(localPreviewData);
            }
          }
        }
      }
    })
  }

  flattenCoQDataArr(arr: CoQData[]): any[] {
    if (arr?.length) {
      const flattened = [];
      for (let obj of arr) {
        for (let key in obj) {
          flattened.push(obj[key]);
        }
      }
      return flattened;
    }
    return arr;
  }

  removeFormData(data: any): void {
    const { tank, status } = data;
    const localPreviewData = JSON.parse(localStorage.getItem(LocalDataKeys.COQFORMPREVIEWDATA));
    if (Array.isArray(localPreviewData) && localPreviewData.length) {
      for (let i = 0; i < localPreviewData.length; i++) {
        if (localPreviewData[i][status.toLowerCase()].tank === tank && localPreviewData[i][status.toLowerCase()].status === status) {
          localPreviewData[i][status.toLowerCase()] = {};
          if (Object.keys(localPreviewData[i].diff).length) {
            localPreviewData[i].diff = {};
          }
          localStorage.setItem(LocalDataKeys.COQFORMPREVIEWDATA, JSON.stringify(localPreviewData));
          // Filter off coqData with empty before and after objects 
          this.coqForm.liquidProductPreviewData = localPreviewData.filter((val: CoQData) => {
            return val && (Object.keys(val.before).length > 0 || Object.keys(val.after).length > 0);
          });
          this.coqForm.liquidProductPreviewData$.next(this.coqForm.liquidProductPreviewData);
        }
      }
    }
  }

  /**
   * Check if each tank's CoQData has before, after and diff data.
   * @see CoQData
   */
  get isPreviewDataOk(): boolean {
    const data = this.coqForm.liquidProductPreviewData;
    for (let i = 0; i < data.length; i++) {
      if (!Object.keys(data[i].before).length || Object.keys(data[i].before).length || Object.keys(data[i].after).length) {
        return false;
      }
    }
    return true;
  }
}
