import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import { PopupService } from '../services/popup.service';


@Injectable({
  providedIn: 'root'
})
export class FieldOfficerOrOfficeGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private popUp: PopupService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isFieldOfficer || this.authService.isFOLocation) {
      return true;
    } else {
      this.popUp.open('You do not have access to the page!', 'error');
      this.router.navigate(['/admin/dashboard']);
      return false;
    }
  }
  
}
