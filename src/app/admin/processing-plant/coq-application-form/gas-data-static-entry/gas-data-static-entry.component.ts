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
  selector: 'app-gas-data-static-entry',
  templateUrl: './gas-data-static-entry.component.html',
  styleUrls: ['./gas-data-static-entry.component.css'],
})
export class GasDataStaticEntryComponent implements OnInit, OnChanges {
  @Input() tank: ITank;
  @Input() isBefore: boolean = true;

  public form: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.form = getForm('Gas', 'Static', this.isBefore ? 'before' : 'after');

    this.form.controls['id'].setValue(this.tank?.plantTankId);
    this.form.controls['tank'].setValue(this.tank?.tankName);
  }
}
