import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getForm } from '../forms';
import { ITank } from 'src/app/shared/interfaces/ITank';

@Component({
  selector: 'app-liquid-data-dynamic-entry',
  templateUrl: './liquid-data-dynamic-entry.component.html',
  styleUrls: ['./liquid-data-dynamic-entry.component.css'],
})
export class LiquidDataDynamicEntryComponent implements OnInit, OnChanges {
  @Input() isBefore: boolean = true;
  @Input() tank: ITank = null;

  public form: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    debugger;
    this.form = getForm(
      'Liquid',
      'Dynamic',
      this.isBefore ? 'before' : 'after'
    );

    this.form.controls['id'].setValue(this.tank?.plantTankId);
    this.form.controls['tank'].setValue(this.tank?.tankName);
  }
}
