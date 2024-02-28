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
    const cols = ['temperature', 'vacTemp', 'liquidTemperature'];
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

  public getLiquidCalculatedParams(data: CoQData[]) {
    return data.map((item) => {
      item.calc = {
        dip: parseFloat(item.after.dip) - parseFloat(item.before.dip),
        waterDIP:
          parseFloat(item.after.waterDIP) - parseFloat(item.before.waterDIP),
        tov: parseFloat(item.after.tov) - parseFloat(item.before.tov),
        waterVolume:
          parseFloat(item.after.waterVolume) -
          parseFloat(item.before.waterVolume),
        floatRoofCorr:
          parseFloat(item.after.floatRoofCorr) -
          parseFloat(item.before.floatRoofCorr),
        gov: parseFloat(item.after.gov) - parseFloat(item.before.gov),
        temperature:
          parseFloat(item.after.temperature) -
          parseFloat(item.before.temperature),
        density:
          parseFloat(item.after.density) - parseFloat(item.before.density),
        vcf: parseFloat(item.after.vcf) - parseFloat(item.before.vcf),
      };
      return item;
    });
  }

  public getGasCalculatedParams(data: CoQData[]) {
    return data.map((item) => {
      const correctedLiqVolB4 =
        item.before.observedLiquidVolume + item.before.shrinkageFactorLiquid;
      const correctedLiqVolAft =
        item.after.observedLiquidVolume + item.after.shrinkageFactorLiquid;
      const grossStdVolB4 = correctedLiqVolB4 * item.before.vcf;
      const grossStdVolAft = correctedLiqVolAft * item.after.vcf;
      const vapourVolB4 =
        item.before.tankVolume - item.before.observedLiquidVolume;
      const vapourVolAft =
        item.after.tankVolume - item.after.observedLiquidVolume;
      const correctedVapVolB4 = vapourVolB4 * item?.before.shrinkageFactorVapour;
      const correctedVapVolAft = vapourVolAft * item?.after.shrinkageFactorVapour;
      const vapourWtVacB4 = correctedVapVolB4 * item.before.vapourFactor;
      const vapourWtVacAft = correctedVapVolAft * item.after.vapourFactor;
      const liqDensityAirB4 = parseFloat(
        (item.before?.liquidDensityVac * 0.0011).toFixed(4)
      );
      const liqDensityAirAft = parseFloat(
        (item.after?.liquidDensityVac * 0.0011).toFixed(4)
      );
      const vapourWtAirB4 = parseFloat(
        (
          (liqDensityAirB4 / item.before.liquidDensityVac) *
          vapourWtVacB4
        ).toFixed(4)
      );
      const vapourWtAirAft = parseFloat(
        (
          (liqDensityAirAft / item.after.liquidDensityVac) *
          vapourWtVacAft
        ).toFixed(4)
      );
      const totalWtVacB4 = item.before.liquidDensityVac + vapourWtVacB4;
      const totalWtVacAft = item.after.liquidDensityVac + vapourWtVacAft;
      const totalWtAirB4 = item.before.liqDensityAirB4 + vapourWtAirB4;
      const totalWtAirAft = item.before.liqDensityAirAft + vapourWtAirAft;

      item.calc = {};
      item.calc.before = {
        correctedLiquidLevel:
          item.before.observedSounding + item.before.tapeCorrection,
        correctedLiquidVolume: correctedLiqVolB4,
        grossStandardVolume: grossStdVolB4,
        liquidDensityAir: liqDensityAirB4,
        liquidWeightVac: item.before.liquidDensityVac * grossStdVolB4,
        liquidWeightAir: liqDensityAirB4 * grossStdVolB4,
        vapourVolume: vapourVolB4,
        correctedVapourVolume: correctedVapVolB4,
        vapourWeightVac: vapourWtVacB4,
        vapourWeightAir: vapourWtAirB4,
        totalWeightVac: totalWtVacB4,
        totalWeightAir: totalWtAirB4,
        molecularWeightCalc: (
          item.before?.molecularWeight /
          (22.4 * 1000)
        ).toFixed(4),
        temperatureCalc: (
          273 /
          (273 + item.before?.vapourTemperature)
        ).toFixed(4),
        pressureCalc: ((item.before?.vapourPressure + 1.013) / 1.013).toFixed(
          4
        ),
      };
      item.calc.after = {
        correctedLiquidLevel:
          item.before.observedSounding + item.before.tapeCorrection,
        correctedLiquidVolume: correctedLiqVolAft,
        grossStandardVolume: grossStdVolAft,
        liquidDensityAir: liqDensityAirAft,
        liquidWeightVac: item.after.liquidDensityVac * grossStdVolAft,
        liquidWeightAir: liqDensityAirAft * grossStdVolAft,
        vapourVolume: vapourVolAft,
        correctedVapourVolume: correctedVapVolAft,
        vapourWeightVac: vapourWtVacAft,
        vapourWeightAir: vapourWtAirAft,
        totalWeightVac: totalWtVacAft,
        totalWeightAir: totalWtAirAft,
        molecularWeightCalc: (
          item.after?.molecularWeight /
          (22.4 * 1000)
        ).toFixed(4),
        temperatureCalc: (
          273 /
          (273 + item.after?.vapourTemperature)
        ).toFixed(4),
        pressureCalc: ((item.after?.vapourPressure + 1.013) / 1.013).toFixed(
          4
        ),
      };
      item.calc.totalMetricTonsVac =
        item.calc.after?.liquidWeightVac - item.calc.before?.liquidWeightVac;
      item.calc.totalMetricTonsAir =
        item.calc.after?.liquidWeightAir - item.calc.before?.liquidWeightAir;
      item.calc.receivedQtyVac =
        item.calc.after?.liquidWeightVac +
        item.calc.after?.vapourWeightVac -
        (item.calc.before?.liquidWeightVac +
          item.calc.before?.vapourWeightVac);
      item.calc.receivedQtyAir =
        item.calc.after?.liquidWeightAir +
        item.calc.after?.vapourWeightAir -
        (item.calc.before?.liquidWeightAir +
          item.calc.before?.vapourWeightAir);
      return item;
    }); 
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