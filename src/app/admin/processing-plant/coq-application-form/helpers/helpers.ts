import {
  ICDDataBatches,
  ICDMeterReading,
  ICDMeterReadingForm,
  ICSDataBatch,
  ICSDataBatches,
  ICSMeterReading,
  ICSMeterReadingForm,
  ICSTankReading,
  ILDDataBatches,
  ILDMeterReading,
  ILDMeterReadingForm,
  ILSDataBatch,
  ILSDataBatches,
  ILSTankReading,
} from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { IBatch } from '../data-entry-form/data-entry-form.component';
import { ITank } from 'src/app/shared/interfaces/ITank';
import { IMeter } from 'src/app/shared/interfaces/IMeter';

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
          tankReading: extractLStaticTankReading(reading),
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
          tankReading: extractLStaticTankReading(reading),
        },
      ],
    };
  }
};

export const createNewLDBatch = (
  batch: IBatch,
  meter: IMeter,
  reading: ILDMeterReadingForm,
  isInitial: boolean,
  initialReading: ILDMeterReading = null
): ILDDataBatches => {
  if (isInitial) {
    return {
      batchId: batch.batchId,
      meterReadings: [
        {
          meterId: meter.id,
          temperature: reading.temperature,
          density: reading.density,
          meterFactor: reading.meterFactor,
          ctl: reading.ctl,
          cpl: reading.cpl,
          wtAir: reading.wtAir,
          meterBeforReadingDto: {
            mCube: reading.mCube,
          },
          meterAfterReadingDto: null,
        },
      ],
    };
  } else {
    return {
      batchId: batch.batchId,
      meterReadings: [
        {
          ...initialReading,
          meterAfterReadingDto: {
            mCube: reading.mCube,
          },
        },
      ],
    };
  }
};

export const createNewCDBatch = (
  batch: IBatch,
  meter: IMeter,
  reading: ICDMeterReadingForm,
  isInitial: boolean,
  initialReading: ICDMeterReading = null
): ICDDataBatches => {
  if (isInitial) {
    return {
      batchId: batch.batchId,
      meterReadings: [
        {
          meterId: meter.id,
          temperature: reading.temperature,
          pressure: reading.pressure,
          meterFactor: reading.meterFactor,
          ctl: reading.ctl,
          cpl: reading.cpl,
          apiAt60: reading.apiAt60,
          vcf: reading.vcf,
          bsw: reading.bsw,
          grossLtBblFactor: reading.grossLtBblFactor,
          meterBeforReadingDto: {
            mReadingBbl: reading.mReadingBbl,
          },
          meterAfterReadingDto: null,
        },
      ],
    };
  } else {
    return {
      batchId: batch.batchId,
      meterReadings: [
        {
          ...initialReading,
          meterAfterReadingDto: {
            mReadingBbl: reading.mReadingBbl,
          },
        },
      ],
    };
  }
};

// export const createNewCDBatch = (
//   batch: IBatch,
//   meter: IMeter,
//   reading: ICDMeterReadingForm,
//   isInitial: boolean,
//   initialReading: ICDTankReading = null
// ): ICDDataBatches => {
//   if (isInitial) {
//     return {
//       batchId: batch.batchId,
//       meterReadings: [
//         {
//           meterId: meter.id,
//           temperature: reading.temperature,
//           density: reading.density,
//           meterFactor: reading.meterFactor,
//           ctl: reading.ctl,
//           cpl: reading.cpl,
//           wtAir: reading.wtAir,
//           meterBeforReadingDto: {
//             mCube: reading.mCube,
//           },
//           meterAfterReadingDto: null,
//         },
//       ],
//     };
//   } else {
//     return {
//       batchId: batch.batchId,
//       meterReadings: [
//         {
//           ...initialReading,
//           meterAfterReadingDto: {
//             mCube: reading.mCube,
//           },
//         },
//       ],
//     };
//   }
// };

export const createNewCSBatch = (
  batch: IBatch,
  tank: ITank,
  reading: ICSTankReading,
  isInitial: boolean
): ICSDataBatches => {
  if (isInitial) {
    return {
      batchId: batch.batchId,
      tankBeforeReadings: [
        {
          tankId: tank.plantTankId,
          tankReading: extractCStaticTankReading(reading),
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
          tankReading: extractCStaticTankReading(reading),
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
    tankReading: extractLStaticTankReading(reading),
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

export const updateCSBatch = (
  coqBatch: ICSDataBatches,
  tank: ITank,
  reading: ICSTankReading,
  isInitial: boolean
): ICSDataBatches => {
  const tankReading: ICSDataBatch = {
    tankId: tank.plantTankId,
    tankReading: extractCStaticTankReading(reading),
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

export const updateLDBatch = (
  coqBatch: ILDDataBatches,
  meter: IMeter,
  reading: ILDMeterReadingForm,
  isInitial: boolean,
  initialReading: ILDMeterReading = null
): ILDDataBatches => {
  if (isInitial) {
    const meterReading: ILDMeterReading = {
      meterId: meter.id,
      temperature: reading.temperature,
      density: reading.density,
      meterFactor: reading.meterFactor,
      ctl: reading.ctl,
      cpl: reading.cpl,
      wtAir: reading.wtAir,
      meterBeforReadingDto: {
        mCube: reading.mCube,
      },
      meterAfterReadingDto: null,
    };

    if (coqBatch.meterReadings) {
      coqBatch.meterReadings = coqBatch.meterReadings.filter(
        (x) => x.meterId !== meterReading.meterId
      );
      coqBatch.meterReadings.push(meterReading);
    } else {
      coqBatch.meterReadings = [meterReading];
    }
    return coqBatch;
  } else {
    const meterReading: ILDMeterReading = {
      ...initialReading,
      meterAfterReadingDto: {
        mCube: reading.mCube,
      },
    };

    if (coqBatch.meterReadings) {
      coqBatch.meterReadings = coqBatch.meterReadings.filter(
        (x) => x.meterId !== meterReading.meterId
      );
      coqBatch.meterReadings.push(meterReading);
    } else {
      coqBatch.meterReadings = [meterReading];
    }
    return coqBatch;
  }
};

export const updateCDBatch = (
  coqBatch: ICDDataBatches,
  meter: IMeter,
  reading: ICDMeterReadingForm,
  isInitial: boolean,
  initialReading: ICDMeterReading = null
): ICDDataBatches => {
  if (isInitial) {
    const meterReading: ICDMeterReading = {
      meterId: meter.id,
      temperature: reading.temperature,
      pressure: reading.pressure,
      meterFactor: reading.meterFactor,
      ctl: reading.ctl,
      cpl: reading.cpl,
      apiAt60: reading.apiAt60,
      vcf: reading.vcf,
      bsw: reading.bsw,
      grossLtBblFactor: reading.grossLtBblFactor,
      meterBeforReadingDto: {
        mReadingBbl: reading.mReadingBbl,
      },
      meterAfterReadingDto: null,
    };

    if (coqBatch.meterReadings) {
      coqBatch.meterReadings = coqBatch.meterReadings.filter(
        (x) => x.meterId !== meterReading.meterId
      );
      coqBatch.meterReadings.push(meterReading);
    } else {
      coqBatch.meterReadings = [meterReading];
    }
    return coqBatch;
  } else {
    const meterReading: ICDMeterReading = {
      ...initialReading,
      meterAfterReadingDto: {
        mReadingBbl: reading.mReadingBbl,
      },
    };

    if (coqBatch.meterReadings) {
      coqBatch.meterReadings = coqBatch.meterReadings.filter(
        (x) => x.meterId !== meterReading.meterId
      );
      coqBatch.meterReadings.push(meterReading);
    } else {
      coqBatch.meterReadings = [meterReading];
    }
    return coqBatch;
  }
};

export const extractLStaticTankReading = (reading: any): ILSTankReading => {
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

export const extractCStaticTankReading = (reading: any): ICSTankReading => {
  const result: ICSTankReading = {
    measurementType: reading.measurementType,
    ullage: reading.ullage,
    tankTemp: reading.tankTemp,
    tov: reading.tov,
    bsw: reading.bsw,
    waterGuage: reading.waterGuage,
    obsvWater: reading.obsvWater,
    apiAt60: reading.apiAt60,
    vcf: reading.vcf,
    ltBblFactor: reading.ltBblFactor,
  };

  return result;
};
