import { FormBuilder, Validators } from '@angular/forms';
import { MeasurementType } from './coq-application-pp-form.component';

export const getForm = (
  productType: 'Liquid' | 'Gas',
  measurementType: MeasurementType,
  status: 'before' | 'after'
) => {
  console.log('prod', productType, measurementType, status);
  const mappings = {
    Liquid: {
      Dynamic: LIQUID_DYNAMIC_FORM(status),
      Static: LIQUID_STATIC_FORM(status),
    },
    Gas: {
      Dynamic: GAS_DYNAMIC_FORM(status),
      Static: GAS_STATIC_FORM(status),
    },
  };

  return mappings[productType][measurementType];
};

let fb = new FormBuilder();

const LIQUID_DYNAMIC_FORM = (status: 'before' | 'after') =>
  fb.group({
    id: ['', [Validators.required]],
    tank: ['', [Validators.required]],
    status: [status || '', [Validators.required]],
    dip: ['', [Validators.required]],
    waterDIP: ['', [Validators.required]],
    tov: ['', [Validators.required]],
    waterVolume: ['', [Validators.required]],
    floatRoofCorr: ['', [Validators.required]],
    gov: ['', [Validators.required]],
    temperature: ['', [Validators.required]],
    density: ['', [Validators.required]],
    vcf: ['', [Validators.required]],
  });

const LIQUID_STATIC_FORM = (status: 'before' | 'after') =>
  fb.group({
    id: ['', [Validators.required]],
    tank: ['', [Validators.required]],
    status: [status || '', [Validators.required]],
    dip: ['', [Validators.required]],
    waterDIP: ['', [Validators.required]],
    tov: ['', [Validators.required]],
    waterVolume: ['', [Validators.required]],
    floatRoofCorr: ['', [Validators.required]],
    gov: ['', [Validators.required]],
    temperature: ['', [Validators.required]],
    density: ['', [Validators.required]],
    vcf: ['', [Validators.required]],
  });

const GAS_DYNAMIC_FORM = (status: 'before' | 'after') =>
  fb.group({
    id: ['', [Validators.required]],
    tank: ['', [Validators.required]],
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
    id: ['', [Validators.required]],
    tank: ['', [Validators.required]],
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
