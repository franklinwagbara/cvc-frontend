import { Component, Input } from '@angular/core';
import { ProcessingPlantContextService } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { IDataEntryResult } from '../condensate-data-dynamic-entry/before-condensate-dynamic-data-entry/before-condensate-dynamic-data-entry.component';
import { MatStep } from '@angular/material/stepper';

@Component({
  selector: 'app-condensate-data-static-entry',
  templateUrl: './condensate-data-static-entry.component.html',
  styleUrls: ['./condensate-data-static-entry.component.css'],
})
export class CondensateDataStaticEntryComponent {
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
      this.ppContext.addLiquidStaticBatchReading(output.formValue, true);
    } else {
      this.isFinalCompleted = true;
      this.ppContext.addLiquidStaticBatchReading(output.formValue, false);
    }
  }

  public onCompleteEntry() {
    debugger;
    this.batchStepper?.select();
    this.ppContext.isCompletedDataEntry$.next(true);
    this.isShow = false;
  }
}
