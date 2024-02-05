import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITank } from '../../interfaces/ITank';
import { IMeter } from '../../interfaces/IMeter';
import { MeasurementSystem } from 'src/app/admin/processing-plant/coq-application-form/helpers/Types';
import { IBatch } from 'src/app/admin/processing-plant/coq-application-form/data-entry-form/data-entry-form.component';
import { IPlant } from '../../interfaces/IPlant';
import {
  createNewLSBatch,
  updateLSBatch,
} from 'src/app/admin/processing-plant/coq-application-form/helpers/helpers';

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

  public LDBatchReadings$ = new BehaviorSubject<IBatch[]>(null);
  public LDBatchReadingsObs = this.LDBatchReadings$.asObservable();

  public LSBatchReadings$ = new BehaviorSubject<ILSDataBatches[]>(null);
  public LSBatchReadingsObs = this.LSBatchReadings$.asObservable();

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
}

export interface ILSDataBatches {
  batchId: number;
  tankBeforeReadings: ILSDataBatch[];
  tankAfterReadings: ILSDataBatch[];
}

export interface ILSDataBatch {
  tankId: number;
  tankReading: ILSTankReading;
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
