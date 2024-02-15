import { FormBuilder, Validators } from '@angular/forms';
import { MeasurementType } from './coq-application-pp-form.component';

export const getForm = (
  productType: 'Liquid' | 'Gas' | 'Condensate',
  measurementType: MeasurementType,
  status: 'before' | 'after'
) => {
  const mappings = {
    Liquid: {
      Dynamic: LIQUID_DYNAMIC_FORM(status),
      Static: LIQUID_STATIC_FORM(status),
    },
    Gas: {
      Dynamic: GAS_DYNAMIC_FORM(status),
      Static: GAS_STATIC_FORM(status),
    },
    Condensate: {
      Dynamic: CONDENSATE_DYNAMIC_FORM(status),
      Static: CONDENSATE_STATIC_FORM(status),
    },
  };

  return mappings[productType][measurementType];
};

export const getDetailsForm = (
  productType: 'Liquid' | 'Gas' | 'Condensate'
) => {
  const mappings = {
    Liquid: PROCESSING_DETAILS_LIQUID_FORM,
    Gas: PROCESSING_DETAILS_GAS_FORM,
    Condensate: PROCESSING_DETAILS_CONDENSATE_FORM,
  };

  return mappings[productType];
};

let fb = new FormBuilder();

const LIQUID_DYNAMIC_FORM = (status: 'before' | 'after') =>
  fb.group({
    id: [''],
    tank: [''],
    status: [status || '', [Validators.required]],
    batch: [''],
    readingM: ['', [Validators.required]],
    temperature: ['', [Validators.required]],
    density: ['', [Validators.required]],
    meterFactor: ['', [Validators.required]],
    ctl: ['', [Validators.required]],
    cpl: ['', [Validators.required]],
    wtAir: ['', [Validators.required]],
  });

const LIQUID_STATIC_FORM = (status: 'before' | 'after') =>
  fb.group({
    id: [''],
    tank: [''],
    status: [status || '', [Validators.required]],
    measurementType: ['static', [Validators.required]],
    readingM: ['', [Validators.required]],
    temperature: ['', [Validators.required]],
    density: ['', [Validators.required]],
    specificGravityObs: ['', [Validators.required]],
    gov: ['', [Validators.required]],
    barrelsAtTankTables: ['', [Validators.required]],
    volumeCorrectionFactor: ['', [Validators.required]],
    wtAir: ['', [Validators.required]],
  });

const GAS_DYNAMIC_FORM = (status: 'before' | 'after') =>
  fb.group({
    id: [''],
    tank: [''],
    status: [status || '', [Validators.required]],
    liquidDensityVac: ['', [Validators.required]],
    observedSounding: ['', [Validators.required]],
    tapeCorrection: ['', [Validators.required]],
    liquidTemperature: ['', [Validators.required]],
    observedLiquidVolume: ['', [Validators.required]],
    shrinkageFactor: ['', [Validators.required]],
    vcf: ['', [Validators.required]],
    tankVolume: ['', [Validators.required]],
    vapourTemperature: ['', [Validators.required]],
    vapourPressure: ['', [Validators.required]],
    molecularWeight: ['', [Validators.required]],
    vapourFactor: ['', [Validators.required]],
  });

const GAS_STATIC_FORM = (status: 'before' | 'after') =>
  fb.group({
    id: [''],
    tank: [''],
    status: [status || '', [Validators.required]],
    liquidDensityVac: ['', [Validators.required]],
    observedSounding: ['', [Validators.required]],
    tapeCorrection: ['', [Validators.required]],
    liquidTemperature: ['', [Validators.required]],
    observedLiquidVolume: ['', [Validators.required]],
    shrinkageFactor: ['', [Validators.required]],
    vcf: ['', [Validators.required]],
    tankVolume: ['', [Validators.required]],
    vapourTemperature: ['', [Validators.required]],
    vapourPressure: ['', [Validators.required]],
    molecularWeight: ['', [Validators.required]],
    vapourFactor: ['', [Validators.required]],
  });

const CONDENSATE_DYNAMIC_FORM = (status: 'before' | 'after') =>
  fb.group({
    meterId: [''],
    // tank: [''],
    status: [status || '', [Validators.required]],
    batch: [''],
    readingM: ['', [Validators.required]],
    temperature: ['', [Validators.required]],
    density: ['', [Validators.required]],
    meterFactor: ['', [Validators.required]],
    ctl: ['', [Validators.required]],
    cpl: ['', [Validators.required]],
    wtAir: ['', [Validators.required]],
  });

const CONDENSATE_STATIC_FORM = (status: 'before' | 'after') =>
  fb.group({
    tankId: [''],
    // tank: [''],
    status: [status || '', [Validators.required]],
    measurementType: ['static', [Validators.required]],
    readingM: ['', [Validators.required]],
    temperature: ['', [Validators.required]],
    density: ['', [Validators.required]],
    specificGravityObs: ['', [Validators.required]],
    gov: ['', [Validators.required]],
    barrelsAtTankTables: ['', [Validators.required]],
    volumeCorrectionFactor: ['', [Validators.required]],
    wtAir: ['', [Validators.required]],
  });

const PROCESSING_DETAILS_LIQUID_FORM = fb.group({
  startTime: ['', [Validators.required, Validators.max]],
  endTime: ['', [Validators.required]],
  plantPrice: ['', [Validators.required]],
  consignorName: ['', [Validators.required]],
  consignee: ['', [Validators.required]],
  shipFigure: ['', [Validators.required]],
  shoreFigure: ['', [Validators.required]],
  shipmentNo: ['', [Validators.required]],
  destination: ['', [Validators.required]],
  terminal: ['', [Validators.required]],
  tankerName: ['', [Validators.required]], //todo: add from backend
  averageDensity: ['', [Validators.required]], //todo: add from backend
});

const PROCESSING_DETAILS_GAS_FORM = fb.group({
  vesselArrivalDate: ['', [Validators.required]],
  prodDischargeCommenceDate: ['', [Validators.required]],
  prodDischargeCompletionDate: ['', [Validators.required]],
  qtyBillLadingMtAir: ['', [Validators.required]],
  arrivalShipMtAir: ['', [Validators.required]],
  shipDischargedMtAir: ['', [Validators.required]],
  nameConsignee: ['', [Validators.required]],
  depotPrice: ['', [Validators.required]],
});

const PROCESSING_DETAILS_CONDENSATE_FORM = fb.group({
  plantId: ['', [Validators.required]],
  productId: ['', [Validators.required]],
  measurementSystem: ['', [Validators.required]],
  startTime: ['', [Validators.required, Validators.max]],
  endTime: ['', [Validators.required]],
  price: ['', [Validators.required]],
  deliveredLongTonsAir: ['', [Validators.required]],
  deliveredMTAir: ['', [Validators.required]],
  deliveredMTVac: ['', [Validators.required]],
  deliveredUsBarrelsAt15Degree: ['', [Validators.required]],
  deliveredMCubeAt15Degree: ['', [Validators.required]],
  prevWTAir: ['', [Validators.required]],
  prevUsBarrelsAt15Degree: ['', [Validators.required]],
  consignorName: ['', [Validators.required]],
  consignee: ['', [Validators.required]],
  shipFigure: ['', [Validators.required]],
  // shoreFigure: ['', [Validators.required]],
  shipmentNo: ['', [Validators.required]],
  destination: ['', [Validators.required]],
  terminal: ['', [Validators.required]],
  // tankerName: ['', [Validators.required]],
  dipMethodId: ['', [Validators.required]],
});
