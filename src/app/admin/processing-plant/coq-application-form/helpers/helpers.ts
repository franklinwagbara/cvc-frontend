import {
  ILSDataBatch,
  ILSDataBatches,
  ILSTankReading,
} from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { IBatch } from '../data-entry-form/data-entry-form.component';
import { ITank } from 'src/app/shared/interfaces/ITank';

export const extractStaticTankReading = (reading: any): ILSTankReading => {
  const result: ILSTankReading = {
    measurementType: reading.measurementType,
    readingM: reading.readingM,
    temperature: reading.temperature,
    density: reading.density,
    specificGravityObs: reading.specificGravityObs,
    barrelsAtTankTables: reading.barrelsAtTankTables,
    volumeCorrectionFactor: reading.volumeCorrectionFactor,
    wtAir: reading.wtAir,
  };

  return result;
};

export const createNewLSBatch = (
  batch: IBatch,
  tank: ITank,
  reading: ILSTankReading,
  isInitial: boolean
): ILSDataBatches => {
  if (isInitial) {
    return {
      batchId: batch.batchId,
      tankBeforeReadings: [
        {
          tankId: tank.plantTankId,
          tankReading: extractStaticTankReading(reading),
        },
      ],
      tankAfterReadings: null,
    };
  } else {
    return {
      batchId: batch.batchId,
      tankBeforeReadings: null,
      tankAfterReadings: [
        {
          tankId: tank.plantTankId,
          tankReading: extractStaticTankReading(reading),
        },
      ],
    };
  }
};
export const createNewLDBatch = (
  batch: IBatch,
  tank: ITank,
  reading: ILSTankReading,
  isInitial: boolean
): ILSDataBatches => {
  if (isInitial) {
    return {
      batchId: batch.batchId,
      tankBeforeReadings: [
        {
          tankId: tank.plantTankId,
          tankReading: extractStaticTankReading(reading),
        },
      ],
      tankAfterReadings: null,
    };
  } else {
    return {
      batchId: batch.batchId,
      tankBeforeReadings: null,
      tankAfterReadings: [
        {
          tankId: tank.plantTankId,
          tankReading: extractStaticTankReading(reading),
        },
      ],
    };
  }
};

export const updateLSBatch = (
  coqBatch: ILSDataBatches,
  tank: ITank,
  reading: ILSTankReading,
  isInitial: boolean
): ILSDataBatches => {
  const tankReading: ILSDataBatch = {
    tankId: tank.plantTankId,
    tankReading: extractStaticTankReading(reading),
  };

  if (isInitial) {
    if (coqBatch.tankBeforeReadings) {
      coqBatch.tankBeforeReadings = coqBatch.tankBeforeReadings.filter(
        (x) => x.tankId !== tankReading.tankId
      );
      coqBatch.tankBeforeReadings.push(tankReading);
    } else {
      coqBatch.tankBeforeReadings = [tankReading];
    }
    return coqBatch;
  } else {
    if (coqBatch.tankAfterReadings) {
      coqBatch.tankAfterReadings = coqBatch.tankAfterReadings.filter(
        (x) => x.tankId !== tankReading.tankId
      );
      coqBatch.tankAfterReadings.push(tankReading);
    } else {
      coqBatch.tankAfterReadings = [tankReading];
    }
    return coqBatch;
  }
};
