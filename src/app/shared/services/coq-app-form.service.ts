import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CoQData, LiquidProductData, LocalDataKey } from '../../../../src/app/admin/coq-application-form/coq-application-form.component';
import { DialogData, EditCoqFormComponent } from '../../../../src/app/admin/coq-application-form/edit-coq-form/edit-coq-form.component';

@Injectable({
  providedIn: 'root'
})
export class CoqAppFormService {
  public configuredTanks: string[] = [];
  public liquidProductReviewData: any[] = [];
  public liquidProductReviewData$ = new BehaviorSubject<any[]>([]);
  public gasProductReviewData: any[] = [];
  public gasProductReviewData$ = new BehaviorSubject<any[]>([]);
  public formDataEvent = new EventEmitter<'edited' | 'removed'>();

  constructor(public dialog: MatDialog) {
    this.liquidProductReviewData$.subscribe((val: any[]) => {
      this.liquidProductReviewData = val.filter((val: CoQData) => {
        return val && (Object.keys(val.before).length > 0 || Object.keys(val.after).length > 0);
      });
    })
    this.gasProductReviewData$.subscribe((val: any[]) => {
      this.gasProductReviewData = val.filter((val: CoQData) => {
        return val && (Object.keys(val.before).length > 0 || Object.keys(val.after).length > 0);
      });
    })
  }

  public hasMeterCubeUnit(colKey: string) {
    const cols = ['tov', 'corr', 'gov', 'gsv', 'observedLiqVol'];
    return cols.includes(colKey);
  }

  public hasMeterUnit(colKey: string) {
    const cols = ['tapeCorr', 'obsSounding'];
    return cols.includes(colKey);
  }

  public hasTempUnit(colKey: string) {
    const cols = ['temp', 'vacTemp', 'liqTemp'];
    return cols.includes(colKey);
  }

  public hasNoUnit(colKey: string) {
    const colsWithUnit = ['tov', 'corr', 'gov', 'gsv', 'temp', 'tankVol100', 'vcf', 'shrinkageFactor', 'vapPressure', 'molWt', 'obsSounding', 'tapeCorr', 'liqTemp', 'observedLiqVol'];
    return !colsWithUnit.includes(colKey);
  }

  public flattenCoQDataArr(arr: CoQData[]): any[] {
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

  public openEditDialog(dialogData: DialogData, localDataKey: LocalDataKey): void {
    const dialogRef = this.dialog.open(EditCoqFormComponent, 
      { data: dialogData, closeOnNavigation: true, width: '400px', height: '400px' });
    dialogRef.afterClosed().subscribe((result: LiquidProductData) => {
      if (result) {
        const { tank, status } = result;
        const data = JSON.parse(localStorage.getItem(localDataKey));
        if (Array.isArray(data) && data.length) {
          for (let coqData of data) {
            if (coqData[status].tank === tank && coqData[status].status === status) {
              coqData[status] = result;
              // Check if diff data exists and update
              if (Object.keys(coqData['diff']).length) {
                let data: CoQData = coqData;
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
              localStorage.setItem(localDataKey, JSON.stringify(data));
              if (localDataKey === LocalDataKey.COQFORMREVIEWDATA) {
                this.liquidProductReviewData = data.filter((val: CoQData) => {
                  return val && (Object.keys(val.before).length > 0 || Object.keys(val.after).length > 0);
                });
                this.liquidProductReviewData$.next(data);
              }
            }
          }
        }
      }
    });
  }

  removeFormData(data: any, localDataKey: LocalDataKey, isGasProduct: boolean): void {
    const { tank, status } = data;
    let localData = JSON.parse(localStorage.getItem(localDataKey));
    if (Array.isArray(localData) && localData.length) {
      for (let i = 0; i < localData.length; i++) {
        console.log('Local Data =========> ', localData[i]);
        if (localData[i][status.toLowerCase()].tank === tank) {
          localData = localData.slice(0, i).concat(localData.slice(i+1));

          if (isGasProduct) {
            this.gasProductReviewData$.next(localData);
          } else {
            this.liquidProductReviewData$.next(localData);
          }
          
          localStorage.setItem(localDataKey, JSON.stringify(localData));
          this.formDataEvent.emit('removed');
          break;
        }
      }
    }
  }
}
