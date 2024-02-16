import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getDetailsForm } from '../forms';

@Component({
  selector: 'app-processing-details-condensate',
  templateUrl: './processing-details-condensate.component.html',
  styleUrls: ['./processing-details-condensate.component.css'],
})
export class ProcessingDetailsCondensateComponent implements OnInit {
  public form: FormGroup;
  public dateTimeConfig: IDateTiimeConfig = DATETIME_CONFIG;

  public dateControl = new FormControl(
    new Date(2021, 9, 4, 5, 6, 7),
    Validators.required
  );

  ngOnInit(): void {
    this.form = getDetailsForm('Condensate');
  }

  public dateValidation = {
    min: new Date(new Date().getFullYear() - 10, 0, 1),
    max: new Date(),
  };
}

export const DATETIME_CONFIG: IDateTiimeConfig = {
  showSpinners: true,
  showSeconds: false,
  stepHour: 1,
  stepMinute: 1,
  stepSecond: 1,
  touchUi: false,
  color: undefined,
  enableMeridian: true,
  disableMinute: false,
  hideTime: false,
};

export interface IDateTiimeConfig {
  showSpinners: boolean;
  showSeconds: boolean;
  stepHour: number;
  stepMinute: number;
  stepSecond: number;
  touchUi: boolean;
  color: any;
  enableMeridian: boolean;
  disableMinute: boolean;
  hideTime: boolean;
}
