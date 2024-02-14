import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { decodeFullUserInfo } from '../../helpers/tokenUtils';
import { LOCATION } from '../constants/location';
import { UserRole } from '../constants/userRole';
import { PopupService } from '../services/popup.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsGuard implements CanActivate {
  constructor(
    private router: Router,
    private popUp: PopupService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const currentUser = decodeFullUserInfo();
    if (currentUser?.location === LOCATION.HQ || currentUser?.userRoles === UserRole.SUPERADMIN) {
      return true;
    } else {
      this.popUp.open('You do not have access to the page!', 'error');
      return false;
    }
  }
}
