import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import { PopupService } from '../services/popup.service';

@Injectable({
  providedIn: 'root'
})
export class DssriCoqGuard implements CanActivate {
  constructor(
    private auth: AuthenticationService,
    private popUp: PopupService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.auth.isDssriStaff && this.auth.isFieldOfficer) {
      return true;
    } else {
      this.popUp.open('Access Denied!', 'error');
      return false;
    }
  }
  
}
