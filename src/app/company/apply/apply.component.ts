import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../shared/services';

@Component({
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
})
export class ApplyComponent {
  public genk: GenericService;

  constructor(
    private gen: GenericService,
    private router: Router,
    private auth: AuthenticationService
  ) {
    this.genk = gen;
  }

  public onSelect(type: 'new' | 'renew') {
    this.router.navigate(['company', type]);
  }
}
