import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ITank } from 'src/app/shared/interfaces/ITank';
import { getForm } from '../forms';

@Component({
  selector: 'app-liquid-data-static-entry',
  templateUrl: './liquid-data-static-entry.component.html',
  styleUrls: ['./liquid-data-static-entry.component.css'],
})
export class LiquidDataStaticEntryComponent implements OnInit, OnChanges {
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
    this.form = getForm('Liquid', 'Static', this.isBefore ? 'before' : 'after');

    this.form.controls['id'].setValue(this.tank?.plantTankId);
    this.form.controls['tank'].setValue(this.tank?.tankName);
  }
}
