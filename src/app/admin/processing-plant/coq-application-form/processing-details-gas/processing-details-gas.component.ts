import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getDetailsForm } from '../forms';

@Component({
  selector: 'app-processing-details-gas',
  templateUrl: './processing-details-gas.component.html',
  styleUrls: ['./processing-details-gas.component.css'],
})
export class ProcessingDetailsGasComponent {
  public form: FormGroup;

  ngOnInit(): void {
    this.form = getDetailsForm('Gas');
  }

  public dateValidation = {
    min: new Date(new Date().getFullYear() - 10, 0, 1),
    max: new Date(),
  };
}
