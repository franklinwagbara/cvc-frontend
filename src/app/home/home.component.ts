import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GuardsCheckEnd, Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, GenericService } from '../shared/services';
import { environment as envr } from 'src/environments/environment';
import { UserType } from '../shared/constants/userType';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class homeComponent implements OnInit {
  public isLoading$ = new BehaviorSubject<boolean>(false);
  title = 'AUS2FrontEnd';
  emailModal = false;
  loginForm: FormGroup;
  email: string;
  public userId: string;
  genk: GenericService;
  appid: string;
  elpsbase: string;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private gen: GenericService,
    private auth: AuthenticationService
  ) {
    this.genk = gen;
    this.elpsbase = envr.elpsBase;
    this.appid = envr.appid;

    // this.isLoading$.next(true);
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('currentUser'));

      let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

      if (user.userType === UserType.Company)
        this.router.navigate([returnUrl || '/company/dashboard']);
      else this.router.navigate([returnUrl || '/admin']);
      return;
    }

    this.route.queryParams.subscribe((params) => {
      // this.email = params['email'];
      this.userId = params['id'];

      // debugger;
      if (!this.auth.isLoggedIn && this.userId) {
        this.isLoading$.next(true);

        this.auth
          .login(
            // this.email, ''
            this.userId
          )
          .subscribe((user) => {
            if (user) {
              let returnUrl =
                this.route.snapshot.queryParamMap.get('returnUrl');
              if (user.userRoles === UserType.Company) {
                this.router.navigate([returnUrl || '/company/dashboard']);
              } else {
                this.router.navigate([returnUrl || '/admin']);
              }
            }

            this.isLoading$.next(false);
          });
      }
    });
  }

  // toggleEmailModal() {
  //   if (!this.emailModal) {
  //     this.emailModal = true;
  //   } else {
  //     this.emailModal = false;
  //   }
  //   this.cd.markForCheck();
  // }
}
