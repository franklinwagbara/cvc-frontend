import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import { PopupService } from '../services/popup.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isCompany) return true;
    this.router.navigate(['/access-denied'], {
      queryParams: { returnUrl: state.url },
    });

    return true;
  }
}

//lab stackholders
@Injectable({
  providedIn: 'root',
})
export class CompleteProfileGuard {
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private popupService: PopupService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.auth.currentUser;
    const operatingFacility = currentUser?.OperatingFacility;

    if (operatingFacility !== null && currentUser.profileComplete) {
      return true;
    } else {
      // if (operatingFacility === null) {
      //   this.popupService.open('Select your Operating facility', 'error');
      // } else {
      this.router.navigate(['/company/companyinformation'], {
        queryParams: { returnUrl: state.url },
      });

      this.popupService.open('Complete your profile', 'error');
      // }
      return false;
    }
  }
}

export const AuthCompleteProfileGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(CompleteProfileGuard).canActivate(next, state);
};
