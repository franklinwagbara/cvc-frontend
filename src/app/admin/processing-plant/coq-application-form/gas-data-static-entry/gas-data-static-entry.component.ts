import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gas-data-static-entry',
  templateUrl: './gas-data-static-entry.component.html',
  styleUrls: ['./gas-data-static-entry.component.css'],
})
export class GasDataStaticEntryComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() isBefore: boolean = true;

  constructor() {}

  ngOnInit(): void {
    debugger;
  }
}
