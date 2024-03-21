import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getForm } from '../../forms';
import { Subscription } from 'rxjs';
import { IDataEntryResult } from '../before-liquid-dynamic-data-entry/before-liquid-dynamic-data-entry.component';
import { ProcessingPlantContextService } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { ProductType } from 'src/app/shared/constants/productType';
import { MeasurementType } from 'src/app/shared/constants/measurement-type';

@Component({
  selector: 'app-after-liquid-dynamic-data-entry',
  templateUrl: './after-liquid-dynamic-data-entry.component.html',
  styleUrls: ['./after-liquid-dynamic-data-entry.component.css'],
})
export class AfterLiquidDynamicDataEntryComponent implements OnDestroy {
  @Output() onCompleted = new EventEmitter<IDataEntryResult>();

  public form: FormGroup;

  public allSubscriptions = new Subscription();

  constructor(private ppContext: ProcessingPlantContextService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeFormCompletion();
  }

  private initForm() {
    this.form = getForm(ProductType.LIQUID, MeasurementType.DYNAMIC, 'after');

    // this.form.controls['id'].setValue(
    //   this.ppContext.selectedTank$.value?.plantTankId
    // );
    // this.form.controls['tank'].setValue(
    //   this.ppContext.selectedTank$.value?.tankName
    // );
  }

  private subscribeFormCompletion() {
    this.allSubscriptions.add(
      this.form.statusChanges.subscribe((o) => {
        debugger;
        if (o == 'VALID')
          this.onCompleted.emit({
            state: 'final',
            formValue: this.form.value,
          });
      })
    );
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
  }
}
