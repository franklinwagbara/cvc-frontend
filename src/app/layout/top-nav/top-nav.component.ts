import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginModel } from 'src/app/shared/models/login-model';
import { AuthenticationService } from 'src/app/shared/services';
import { PageManagerService } from 'src/app/shared/services/page-manager.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent implements OnInit {
  menuOpen: boolean = true;
  currentUserInfo: LoginModel;

  @Output() onMenuOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private authService: AuthenticationService,
    private pageManagerService: PageManagerService
  ) {}

  ngOnInit(): void {
    this.currentUserInfo = this.authService.currentUser;
    this.pageManagerService.adminSidebarHover.subscribe({
      next: (value: boolean) => {
        this.menuOpen = value;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  navToggle() {
    this.menuOpen = !this.menuOpen;
    this.pageManagerService.adminSidebarMenuOpen = this.menuOpen;
    this.onMenuOpen.emit(this.menuOpen);
  }

  logout() {
    this.authService.logout();
  }
}
