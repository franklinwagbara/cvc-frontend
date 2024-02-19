import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CoQData, GasProductReviewData, LiquidProductReviewData, LocalDataKey } from '../../../../src/app/admin/coq-application-form/coq-application-form.component';
import { DialogData, EditCoqFormComponent } from '../../../../src/app/admin/coq-application-form/edit-coq-form/edit-coq-form.component';
import { ILiquidTankReading } from '../interfaces/ILiquidTankReading';
import { IGasTankReading } from '../interfaces/IGasTankReading';

@Injectable({
  providedIn: 'root'
})
export class CoqAppFormService {
  public configuredTanks: string[] = [];
  public liquidProductReviewData: LiquidProductReviewData[] = [];
  public liquidProductReviewData$ = new BehaviorSubject<LiquidProductReviewData[]>([]);
  public gasProductReviewData: GasProductReviewData[] = [];
  public gasProductReviewData$ = new BehaviorSubject<GasProductReviewData[]>([]);
  public formDataEvent = new EventEmitter<'edited' | 'removed'>();

  liquidProductProps = [
    'id', 
    'tank', 
    'status', 
    'density', 
    'dip', 
    'floatRoofCorr', 
    'gov', 
    'temperature', 
    'tov', 
    'vcf', 
    'waterDIP', 
    'waterVolume'
  ];
  gasProductProps = [
    'id', 
    'tank', 
    'status', 
    'vcf',
    'tankVolume',
    'liquidDensityVac', 
    'observedSounding', 
    'tapeCorrection',
    'liquidTemperature',
    'observedLiquidVolume',
    'shrinkageFactorLiquid',
    'shrinkageFactorVapour',
    'vapourTemperature',
    'vapourPressure',
    'molecularWeight',
    'vapourFactor'
  ]

  constructor(public dialog: MatDialog) {
    this.liquidProductReviewData$.subscribe((value: LiquidProductReviewData[]) => {
      this.liquidProductReviewData = value;
    })
    this.gasProductReviewData$.subscribe((value: GasProductReviewData[]) => {
      this.gasProductReviewData = value;
      console.log('Gas Product Review Data =======> ', this.gasProductReviewData);
    })
  }

  public hasMeterCubeUnit(colKey: string) {
    const cols = ['tov', 'floatRoofCorr', 'gov', 'waterVolume', 'tankVolume', 'observedLiquidVolume'];
    return cols.includes(colKey);
  }

  public hasMeterUnit(colKey: string) {
    const cols = ['tapeCorrection', 'observedSounding'];
    return cols.includes(colKey);
  }

  public hasKgPerL(colKey: string) {
    const cols = ['liquidDensityVac'];
    return cols.includes(colKey);
  }

  public hasTempUnit(colKey: string) {
    const cols = ['temp', 'vacTemp', 'liquidTemperature'];
    return cols.includes(colKey);
  }

  public hasNoUnit(colKey: string) {
    const colsWithUnit = [
      'tov', 'floatRoofCorr', 'gov', 'temperature', 'waterVolume', 'tankVolume', 'observedSounding', 
      'tapeCorrection', 'liquidTemperature', 'observedLiquidVolume', 'liquidDensityVac', 'liquidDensityAir'
    ];
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

  public openEditDialog(dialogData: DialogData, localDataKey: LocalDataKey, isGasProduct?: boolean): void {
    const dialogRef = this.dialog.open(EditCoqFormComponent, 
      { data: dialogData, closeOnNavigation: true, width: '400px', height: '400px' });
    
    if (!isGasProduct) {
      dialogRef.afterClosed().subscribe((result: ILiquidTankReading) => {
        if (result) {
          const { tank, status } = result;
          const data = JSON.parse(localStorage.getItem(localDataKey));
          if (Array.isArray(data) && data.length) {
            for (let coqData of data) {
              if (coqData[status].tank === tank && coqData[status].status === status) {
                coqData[status] = result;
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
    } else {
      dialogRef.afterClosed().subscribe((result: IGasTankReading) => {
        if (result) {
          const { tank, status } = result;
          const data = JSON.parse(localStorage.getItem(localDataKey));
          if (Array.isArray(data) && data.length) {
            for (let coqData of data) {
              if (coqData[status].tank === tank && coqData[status].status === status) {
                coqData[status] = result;
                localStorage.setItem(localDataKey, JSON.stringify(data));
                if (localDataKey === LocalDataKey.COQFORMREVIEWDATA) {
                  this.gasProductReviewData = data.filter((val: CoQData) => {
                    return val && (Object.keys(val.before).length > 0 || Object.keys(val.after).length > 0);
                  });
                  this.gasProductReviewData$.next(data);
                }
              }
            }
          }
        }
      })
    }
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