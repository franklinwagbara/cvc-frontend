import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProcessingPlantContextService } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { getForm } from '../../forms';
import { IDataEntryResult } from '../../liquid-data-dynamic-entry/before-liquid-dynamic-data-entry/before-liquid-dynamic-data-entry.component';

@Component({
  selector: 'app-before-condensate-static-data-entry',
  templateUrl: './before-condensate-static-data-entry.component.html',
  styleUrls: ['./before-condensate-static-data-entry.component.css'],
})
export class BeforeCondensateStaticDataEntryComponent
  implements OnInit, OnDestroy
{
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
    this.form = getForm('Liquid', 'Static', 'before');

    this.form.controls['id'].setValue(
      this.ppContext.selectedTank$.value?.plantTankId
    );
    this.form.controls['tank'].setValue(
      this.ppContext.selectedTank$.value?.tankName
    );
  }

  private subscribeFormCompletion() {
    this.allSubscriptions.add(
      this.form.statusChanges.subscribe((o) => {
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
