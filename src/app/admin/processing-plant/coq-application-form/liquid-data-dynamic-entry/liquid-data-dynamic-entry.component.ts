import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-liquid-data-dynamic-entry',
  templateUrl: './liquid-data-dynamic-entry.component.html',
  styleUrls: ['./liquid-data-dynamic-entry.component.css'],
})
export class LiquidDataDynamicEntryComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() isBefore: boolean = true;

  constructor() {}

  ngOnInit(): void {
    debugger;
  }
}
