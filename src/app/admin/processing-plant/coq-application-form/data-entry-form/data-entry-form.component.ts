import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-data-entry-form',
  templateUrl: './data-entry-form.component.html',
  styleUrls: ['./data-entry-form.component.css'],
})
export class DataEntryFormComponent implements OnInit {
  @Input() beforeForm: FormGroup;
  @Input() afterForm: FormGroup;
  @Input() isBefore: boolean = true;

  public form: FormGroup;

  constructor() {}
  ngOnInit(): void {
    this.form = this.isBefore ? this.beforeForm : this.afterForm;
  }
}
