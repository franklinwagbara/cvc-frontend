import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class SuperadminGuard implements CanActivate {
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.auth.isSuperAdmin) return true;

    this.router.navigate['/access-denied'];

    return false;
  }
  
}
