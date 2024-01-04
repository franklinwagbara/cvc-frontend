import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../../../src/app/shared/services';
import { PageManagerService } from '../../../../src/app/shared/services/page-manager.service';
import { ProgressBarService } from '../../../../src/app/shared/services/progress-bar.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent implements OnInit {
  public isCollapse = false;
  isCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor(
    private pageManagerService: PageManagerService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user login is still valid
    if (!this.authService.isLoggedIn) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      this.router.navigateByUrl('/');
    }
    this.isCollapsed$.subscribe((val: boolean) => {
      this.isCollapse = val;
    })
    this.pageManagerService.adminSidebarHover.subscribe({
      next: (value: boolean) => {
        this.isCollapse = !value;
      },
      error: (err: unknown) => {
        console.error(err);
      }
    })
    
  }

  onMenuOpen(open: boolean) {
    this.isCollapsed$.next(!open);
  }
}
