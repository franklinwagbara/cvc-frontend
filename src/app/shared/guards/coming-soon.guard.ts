import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ComingSoonComponent } from '../reusable-components/coming-soon/coming-soon.component';

@Injectable({
  providedIn: 'root'
})
export class ComingSoonGuard implements CanActivate {
  
  constructor(private dialog: MatDialog) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    this.dialog.open(ComingSoonComponent, null);
    return false;
  }
  
}
