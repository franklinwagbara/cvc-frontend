import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getForm } from '../../forms';
import { Subscription } from 'rxjs';
import { ProcessingPlantContextService } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';

@Component({
  selector: 'app-before-condensate-dynamic-data-entry',
  templateUrl: './before-condensate-dynamic-data-entry.component.html',
  styleUrls: ['./before-condensate-dynamic-data-entry.component.css'],
})
export class BeforeCondensateDynamicDataEntryComponent implements OnDestroy {
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
    this.form = getForm('Condensate', 'Dynamic', 'before');

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
        console.log('testing...', this.form, 0);
        if (o == 'VALID')
          this.onCompleted.emit({
            state: 'initial',
            formValue: this.form.value,
          });
      })
    );
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
  }
}

export interface IDataEntryResult {
  state: 'initial' | 'final';
  formValue: any;
}
