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
import { IDataEntryResult } from '../before-condensate-dynamic-data-entry/before-condensate-dynamic-data-entry.component';
import { ProcessingPlantContextService } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';

@Component({
  selector: 'app-after-condensate-dynamic-data-entry',
  templateUrl: './after-condensate-dynamic-data-entry.component.html',
  styleUrls: ['./after-condensate-dynamic-data-entry.component.css'],
})
export class AfterCondensateDynamicDataEntryComponent implements OnDestroy {
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
    this.form = getForm('Condensate', 'Dynamic', 'after');

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
