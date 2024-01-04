import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { decodeFullUserInfo } from 'src/app/helpers/tokenUtils';

@Injectable({
  providedIn: 'root'
})
export class NoaAndApplicationsGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const currentUser = decodeFullUserInfo();
    if (currentUser?.location === 'HQ' || ['SuperAdmin', 'Admin'].includes(currentUser?.userRoles)) {
      return true;
    }
    return false;
  }
  
}
