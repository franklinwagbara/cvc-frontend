import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeasurementType } from '../coq-application-pp-form.component';

@Component({
  selector: 'app-gas-data-dynamic-entry',
  templateUrl: './gas-data-dynamic-entry.component.html',
  styleUrls: ['./gas-data-dynamic-entry.component.css'],
})
export class GasDataDynamicEntryComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() isBefore: boolean = true;

  constructor() {}

  ngOnInit(): void {
    debugger;
  }
}
