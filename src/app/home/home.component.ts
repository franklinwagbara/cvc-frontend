import {
  ChangeDetectorRef,
  Component,
  OnInit,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment as envr } from '../../../src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService, GenericService } from '../shared/services';
import { UserType } from '../shared/constants/userType';
import { PopupService } from '../shared/services/popup.service';

@Component({
  selector: 'app-root',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class homeComponent implements OnInit {
  public isLoading$ = new BehaviorSubject<boolean>(false);
  title = 'CVCFrontEnd';
  emailModal = false;
  email: string;
  public userId: string;
  genk: GenericService;
  appid: string;
  elpsbase: string;
  windowScreenSize: number;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private gen: GenericService,
    private auth: AuthenticationService,
    private popupService: PopupService
  ) {
    this.genk = gen;
    this.elpsbase = envr.elpsBase;
    this.appid = envr.appid;

    // this.isLoading$.next(true);
  }

  ngOnInit(): void {
    this.windowScreenSize = window.innerWidth;
    if (this.auth.isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

      if (user?.userRoles.includes(UserType.Company)) {
        this.router.navigate([returnUrl || '/company/dashboard']);
      } else this.router.navigate([returnUrl || '/admin']);
      return;
    }

    this.route.queryParams.subscribe((params) => {
      // this.email = params['email'];
      this.userId = params['id'];

      if (!this.auth.isLoggedIn && this.userId) {
        this.isLoading$.next(true);

        this.auth
          .login(
            // this.email, ''
            this.userId
          )
          .subscribe((user) => {
            if (user) {
              const returnUrl =
                this.route.snapshot.queryParamMap.get('returnUrl');
              if (user.userRoles === UserType.Company) {
                if (user.profileComplete) {
                  this.router.navigate([returnUrl || '/company/dashboard']);
                } else {
                  this.router.navigate([
                    returnUrl || '/company/companyinformation',
                  ]);
                  this.popupService.open('Complete your profile', 'success');
                }
              } else {
                this.router.navigate([returnUrl || '/admin']);
              }
            }

            this.isLoading$.next(false);
          });
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowScreenSize = window.innerWidth;
  }
}
