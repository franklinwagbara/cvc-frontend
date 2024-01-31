import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-liquid-data-static-entry',
  templateUrl: './liquid-data-static-entry.component.html',
  styleUrls: ['./liquid-data-static-entry.component.css'],
})
export class LiquidDataStaticEntryComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() isBefore: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
