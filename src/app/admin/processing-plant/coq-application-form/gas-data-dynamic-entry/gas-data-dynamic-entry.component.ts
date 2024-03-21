import { Component, Input } from '@angular/core';
import { MatStep } from '@angular/material/stepper';
import { IDataEntryResult } from '../liquid-data-dynamic-entry/before-liquid-dynamic-data-entry/before-liquid-dynamic-data-entry.component';
import { ProcessingPlantContextService } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';

@Component({
  selector: 'app-gas-data-dynamic-entry',
  templateUrl: './gas-data-dynamic-entry.component.html',
  styleUrls: ['./gas-data-dynamic-entry.component.css'],
})
export class GasDataDynamicEntryComponent {
  @Input() batchStepper: MatStep;
  public isInitialCompleted: boolean = false;
  public isFinalCompleted: boolean = false;

  constructor(private ppContext: ProcessingPlantContextService) {
    this.ppContext.isCompletedDataEntry$.next(false);
  }

  public onCompleted(output: IDataEntryResult) {
    if (output.state == 'initial') {
      this.isInitialCompleted = true;
      this.ppContext.addLiquidDynamicBatchReading(output.formValue, true);
    } else {
      this.isFinalCompleted = true;
      this.ppContext.addLiquidDynamicBatchReading(output.formValue, false);
    }
  }

  public onCompleteEntry() {
    this.batchStepper?.select();
    this.ppContext.isCompletedDataEntry$.next(true);
  }
}
