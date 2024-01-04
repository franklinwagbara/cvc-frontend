import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';


@Injectable({
  providedIn: 'root'
})
export class CoqGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // const currentUser = decodeFullUserInfo();
    // if (currentUser && (!currentUser.location || currentUser.location !== 'FO')) {
    //   this.router.navigateByUrl('/admin');
    //   return false;
    // }
    return true;
  }
  
}
