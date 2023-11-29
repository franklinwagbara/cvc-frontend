import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GuardsCheckEnd, Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, GenericService } from '../shared/services';

@Component({
  selector: 'app-root',
  template: '<div>Redirecting</div>',
  styleUrls: ['../home/home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginRedirectComponent implements OnInit {
  title = 'AUS2FrontEnd';
  emailModal = false;
  loginForm: FormGroup;
  email: string;
  genk: GenericService;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private gen: GenericService,
    private auth: AuthenticationService
  ) {
    this.genk = gen;
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn) return;

    this.cd.markForCheck();
    // this.route.queryParams.subscribe((params: Params) => {
    //   this.email = params['email'];
    // });

    // this.login();
  }

  // login() {
  //   //debugger;
  //   this.auth
  //     .login
  //     // this.email, this.genk.authCode
  //     ()
  //     .subscribe((result) => {
  //       this.router.navigate(['/' + this.genk.company, 'dashboard']);
  //     });
  // }
}
