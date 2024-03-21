import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITank } from '../../interfaces/ITank';
import { IMeter } from '../../interfaces/IMeter';
import { MeasurementSystem } from 'src/app/admin/processing-plant/coq-application-form/helpers/Types';
import { IBatch } from 'src/app/admin/processing-plant/coq-application-form/data-entry-form/data-entry-form.component';
import { IPlant } from '../../interfaces/IPlant';
import {
  createNewCDBatch,
  createNewCSBatch,
  createNewLDBatch,
  createNewLSBatch,
  updateCDBatch,
  updateCSBatch,
  updateLDBatch,
  updateLSBatch,
} from 'src/app/admin/processing-plant/coq-application-form/helpers/helpers';
import { MeasurementType } from 'src/app/admin/processing-plant/coq-application-form/coq-application-pp-form.component';

@Injectable({
  providedIn: 'root',
})
export class ProcessingPlantContextService {
  public isCompletedDataEntry$ = new BehaviorSubject<boolean>(false);
  public isCompletedDataEntryObs = this.isCompletedDataEntry$.asObservable();

  public selectedTank$ = new BehaviorSubject<ITank>(null);
  public selectedTankObs = this.selectedTank$.asObservable();

  public selectedMeter$ = new BehaviorSubject<IMeter>(null);
  public selectedMeterObs = this.selectedMeter$.asObservable();

  public selectedMeasurementSystem$ = new BehaviorSubject<MeasurementSystem>(
    null
  );
  public selectedMeasurementSystemObs =
    this.selectedMeasurementSystem$.asObservable();

  public selectedBatch$ = new BehaviorSubject<IBatch>(null);
  public selectedBatchObs = this.selectedBatch$.asObservable();

  public LDBatchReadings$ = new BehaviorSubject<ILDDataBatches[]>(null);
  public LDBatchReadingsObs = this.LDBatchReadings$.asObservable();

  public LSBatchReadings$ = new BehaviorSubject<ILSDataBatches[]>(null);
  public LSBatchReadingsObs = this.LSBatchReadings$.asObservable();

  public CDBatchReadings$ = new BehaviorSubject<ICDDataBatches[]>(null);
  public CDBatchReadingsObs = this.LDBatchReadings$.asObservable();

  public CSBatchReadings$ = new BehaviorSubject<ICSDataBatches[]>(null);
  public CSBatchReadingsObs = this.LSBatchReadings$.asObservable();

  public selectedProcessingPlant$ = new BehaviorSubject<IPlant>(null);
  public selectedProcessingPlantObs =
    this.selectedProcessingPlant$.asObservable();

  public configuredTanks$ = new BehaviorSubject<ITank[]>(null);
  public configuredTanksObs = this.configuredTanks$.asObservable();

  public configuredMeters$ = new BehaviorSubject<IMeter[]>(null);
  public configuredMetersObs = this.configuredMeters$.asObservable();

  constructor() {}

  //todo: Not completed
  public addLiquidDynamicBatchReading(
    reading: ILDMeterReadingForm,
    isInitial: boolean
  ) {
    try {
      let coqBatches = this.LDBatchReadings$.value;
      if (coqBatches) {
        if (!this.selectedBatch$.value)
          throw new Error('No batch was selected.');

        if (!this.selectedMeter$.value)
          throw new Error('No tank was selected.');

        let coqBatch = coqBatches.find(
          (x) => x.batchId == this.selectedBatch$.value.batchId
        );

        if (coqBatch) {
          coqBatch = updateLDBatch(
            coqBatch,
            this.selectedMeter$.value,
            reading,
            isInitial,
            coqBatch.meterReadings.find(
              (x) => x.meterId == this.selectedMeter$.value.id
            )
          );

          coqBatches = coqBatches.filter(
            (x) => x.batchId !== this.selectedBatch$.value.batchId
          );
          coqBatches.push(coqBatch);
        } else {
          coqBatch = createNewLDBatch(
            this.selectedBatch$.value,
            this.selectedMeter$.value,
            reading,
            isInitial
          );

          coqBatches.push(coqBatch);
        }
      } else {
        coqBatches = [];
        if (!this.selectedBatch$.value)
          throw new Error('No batch was selected.');

        if (!this.selectedMeter$.value)
          throw new Error('No tank was selected.');

        let coqBatch = createNewLDBatch(
          this.selectedBatch$.value,
          this.selectedMeter$.value,
          reading,
          isInitial
        );
        coqBatches.push(coqBatch);
      }

      this.LDBatchReadings$.next(coqBatches);
    } catch (error) {
      console.error('Processing Plant Error', error);
    }
  }

  public addLiquidStaticBatchReading(
    reading: ILSTankReading,
    isInitial: boolean
  ) {
    try {
      let coqBatches = this.LSBatchReadings$.value;
      if (coqBatches) {
        if (!this.selectedBatch$.value)
          throw new Error('No batch was selected.');

        if (!this.selectedTank$.value) throw new Error('No tank was selected.');

        let coqBatch = coqBatches.find(
          (x) => x.batchId == this.selectedBatch$.value.batchId
        );

        if (coqBatch) {
          coqBatch = updateLSBatch(
            coqBatch,
            this.selectedTank$.value,
            reading,
            isInitial
          );

          coqBatches = coqBatches.filter(
            (x) => x.batchId !== this.selectedBatch$.value.batchId
          );
          coqBatches.push(coqBatch);
        } else {
          coqBatch = createNewLSBatch(
            this.selectedBatch$.value,
            this.selectedTank$.value,
            reading,
            isInitial
          );

          coqBatches.push(coqBatch);
        }
      } else {
        coqBatches = [];
        if (!this.selectedBatch$.value)
          throw new Error('No batch was selected.');

        if (!this.selectedTank$.value) throw new Error('No tank was selected.');

        let coqBatch = createNewLSBatch(
          this.selectedBatch$.value,
          this.selectedTank$.value,
          reading,
          isInitial
        );
        coqBatches.push(coqBatch);
      }

      this.LSBatchReadings$.next(coqBatches);
    } catch (error) {
      console.error('Processing Plant Error', error);
    }
  }

  public addCondensateDynamicBatchReading(
    reading: ICDMeterReadingForm,
    isInitial: boolean
  ) {
    try {
      let coqBatches = this.CDBatchReadings$.value;
      if (coqBatches) {
        if (!this.selectedBatch$.value)
          throw new Error('No batch was selected.');

        if (!this.selectedMeter$.value)
          throw new Error('No tank was selected.');

        let coqBatch = coqBatches.find(
          (x) => x.batchId == this.selectedBatch$.value.batchId
        );

        if (coqBatch) {
          coqBatch = updateCDBatch(
            coqBatch,
            this.selectedMeter$.value,
            reading,
            isInitial,
            coqBatch.meterReadings.find(
              (x) => x.meterId == this.selectedMeter$.value.id
            )
          );

          coqBatches = coqBatches.filter(
            (x) => x.batchId !== this.selectedBatch$.value.batchId
          );
          coqBatches.push(coqBatch);
        } else {
          coqBatch = createNewCDBatch(
            this.selectedBatch$.value,
            this.selectedMeter$.value,
            reading,
            isInitial
          );

          coqBatches.push(coqBatch);
        }
      } else {
        coqBatches = [];
        if (!this.selectedBatch$.value)
          throw new Error('No batch was selected.');

        if (!this.selectedMeter$.value)
          throw new Error('No tank was selected.');

        let coqBatch = createNewCDBatch(
          this.selectedBatch$.value,
          this.selectedMeter$.value,
          reading,
          isInitial
        );
        coqBatches.push(coqBatch);
      }

      this.CDBatchReadings$.next(coqBatches);
    } catch (error) {
      console.error('Processing Plant Error', error);
    }
  }

  public addCondensateStaticBatchReading(
    reading: ICSTankReading,
    isInitial: boolean
  ) {
    try {
      let coqBatches = this.CSBatchReadings$.value;
      if (coqBatches) {
        if (!this.selectedBatch$.value)
          throw new Error('No batch was selected.');

        if (!this.selectedTank$.value) throw new Error('No tank was selected.');

        let coqBatch = coqBatches.find(
          (x) => x.batchId == this.selectedBatch$.value.batchId
        );

        if (coqBatch) {
          coqBatch = updateCSBatch(
            coqBatch,
            this.selectedTank$.value,
            reading,
            isInitial
          );

          coqBatches = coqBatches.filter(
            (x) => x.batchId !== this.selectedBatch$.value.batchId
          );
          coqBatches.push(coqBatch);
        } else {
          coqBatch = createNewCSBatch(
            this.selectedBatch$.value,
            this.selectedTank$.value,
            reading,
            isInitial
          );

          coqBatches.push(coqBatch);
        }
      } else {
        coqBatches = [];
        if (!this.selectedBatch$.value)
          throw new Error('No batch was selected.');

        if (!this.selectedTank$.value) throw new Error('No tank was selected.');

        let coqBatch = createNewCSBatch(
          this.selectedBatch$.value,
          this.selectedTank$.value,
          reading,
          isInitial
        );
        coqBatches.push(coqBatch);
      }

      this.CSBatchReadings$.next(coqBatches);
    } catch (error) {
      console.error('Processing Plant Error', error);
    }
  }
}

export interface ILSDataBatches {
  batchId: number;
  tankBeforeReadings: ILSDataBatch[];
  tankAfterReadings: ILSDataBatch[];
}

export interface ICSDataBatches {
  batchId: number;
  tankBeforeReadings: ICSDataBatch[];
  tankAfterReadings: ICSDataBatch[];
}

export interface ILSDataBatch {
  tankId: number;
  tankReading: ILSTankReading;
}

export interface ICSDataBatch {
  tankId: number;
  tankReading: ICSTankReading;
}

export interface ILDMeterReadingForm {
  meterId: number;
  temperature: number;
  density: number;
  meterFactor: number;
  ctl: number;
  cpl: number;
  wtAir: number;
  mCube: number;
}

export interface ICSMeterReadingForm {
  tankId: number;
  measurementType: MeasurementType;
  ullage: number;
  tankTemp: number;
  tov: number;
  bsw: number;
  waterGuage: number;
  obsvWater: number;
  apiAt60: number;
  vcf: number;
  ltBblFactor: number;
}

export interface ICDMeterReadingForm {
  meterId: number;
  temperature: number;
  pressure: number;
  meterFactor: number;
  ctl: number;
  cpl: number;
  apiAt60: number;
  vcf: number;
  bsw: number;
  grossLtBblFactor: number;
  mReadingBbl: number;
}

export interface ICSTankReadingForm {
  tankId: number;
  measurementType: MeasurementType;
  ullage: number;
  tankTemp: number;
  tov: number;
  bsw: number;
  waterGuage: number;
  obsvWater: number;
  apiAt60: number;
  vcf: number;
  ltBblFactor: number;
}

export interface ILSTankReading {
  measurementType: MeasurementSystem;
  readingM: number;
  temperature: number;
  density: number;
  specificGravityObs: number;
  barrelsAtTankTables: number;
  volumeCorrectionFactor: number;
  wtAir: number;
}

export interface ICSTankReading {
  measurementType: MeasurementType;
  ullage: number;
  tankTemp: number;
  tov: number;
  bsw: number;
  waterGuage: number;
  obsvWater: number;
  apiAt60: number;
  vcf: number;
  ltBblFactor: number;
}

export interface ILDDataBatches {
  batchId: number;
  meterReadings: ILDMeterReading[];
}
export interface ICDDataBatches {
  batchId: number;
  meterReadings: ICDMeterReading[];
}

export interface ILDMeterReading {
  meterId: number;
  temperature: number;
  density: number;
  meterFactor: number;
  ctl: number;
  cpl: number;
  wtAir: number;
  meterBeforReadingDto: {
    mCube: number;
  };
  meterAfterReadingDto: {
    mCube: number;
  };
}

export interface ICDMeterReading {
  meterId: number;
  temperature: number;
  pressure: number;
  meterFactor: number;
  ctl: number;
  cpl: number;
  apiAt60: number;
  vcf: number;
  bsw: number;
  grossLtBblFactor: number;
  meterBeforReadingDto: {
    mReadingBbl: number;
  };
  meterAfterReadingDto: {
    mReadingBbl: number;
  };
}

export interface ICSMeterReading {
  tankId: number;
  measurementType: MeasurementType;
  ullage: number;
  tankTemp: number;
  tov: number;
  bsw: number;
  waterGuage: number;
  obsvWater: number;
  apiAt60: number;
  vcf: number;
  ltBblFactor: number;
}
