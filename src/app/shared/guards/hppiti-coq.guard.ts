import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import { UserRole } from '../constants/userRole';

@Injectable({
  providedIn: 'root'
})
export class HppitiCoqGuard implements CanActivate {
  constructor(private auth: AuthenticationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.auth.isHppitiStaff && (this.auth.isFieldOfficer || this.auth.isFOLocation)) {
      return true;
    }
    return false;
  }
  
}
