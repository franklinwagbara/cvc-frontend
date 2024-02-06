import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Util } from './shared/lib/Util';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './shared/services';
import { UserRole } from './shared/constants/userRole';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CVC & CoQ Portal';
  loading$ = new BehaviorSubject(true);
  hideFooter = false;

  constructor(
    private router: Router, 
    private auth: AuthenticationService
  ) {
    this.router.events.subscribe((obs) => {
      if (obs instanceof NavigationEnd) {
        Util.scrollToTop();
        this.loading$.next(false);
        this.hideFooter = auth.currentUser?.userRoles !== UserRole.COMPANY;
      }
    })
  }
}
