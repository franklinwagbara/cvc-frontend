import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import { decodeFullUserInfo } from '../../helpers/tokenUtils';


@Injectable({
  providedIn: 'root'
})
export class FieldOfficerOrOfficeGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isFieldOfficer || this.authService.isFO) {
      return true;
    } else {
      this.router.navigate(['/admin/dashboard']);
      return false;
    }
  }
  
}
