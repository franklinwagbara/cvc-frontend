import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/shared/services';

@Component({
  templateUrl: 'companyinformation.component.html',
  styleUrls: ['./companyinformation.component.scss'],
})
export class CompanyInformationComponent {
  genk: GenericService;

  constructor(private gen: GenericService) {
    this.genk = gen;
  }
}
