import { Component, Input } from '@angular/core';
import { IDataEntryResult } from './before-condensate-dynamic-data-entry/before-condensate-dynamic-data-entry.component'; 
import { ProcessingPlantContextService } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { MatStep } from '@angular/material/stepper';

@Component({
  selector: 'app-condensate-data-dynamic-entry',
  templateUrl: './condensate-data-dynamic-entry.component.html',
  styleUrls: ['./condensate-data-dynamic-entry.component.css'],
})
export class CondensateDataDynamicEntryComponent {
  @Input() batchStepper: MatStep;
  public isInitialCompleted: boolean = false;
  public isFinalCompleted: boolean = false;

  public isShow = true;

  constructor(private ppContext: ProcessingPlantContextService) {
    this.ppContext.isCompletedDataEntry$.next(false);
  }

  public onCompleted(output: IDataEntryResult) {
    debugger;
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
    this.isShow = false;
  }
}
