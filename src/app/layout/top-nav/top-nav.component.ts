import { ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { LoginModel } from '../../../../src/app/shared/models/login-model';
import { AuthenticationService } from '../../../../src/app/shared/services';
import { PageManagerService } from '../../../../src/app/shared/services/page-manager.service';
import { ScreenDetectorService } from 'src/app/shared/services/screen-detector.service';
import { MatMenu } from '@angular/material/menu';


@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent implements OnInit {
  menuOpen = true;
  currentUserInfo: LoginModel;

  @ViewChild('mobileNavMenu') mobileNavMenu: MatMenu;

  @Output() onMenuOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private authService: AuthenticationService,
    private pageManagerService: PageManagerService,
    public screenDetector: ScreenDetectorService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.currentUserInfo = this.authService.currentUser;
    this.pageManagerService.adminSidebarHover.subscribe({
      next: (value: boolean) => {
        this.menuOpen = value;
      },
      error: (err: unknown) => {
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

  openMobileMenu(): void {
    if (this.mobileNavMenu) {
      (this.mobileNavMenu.templateRef.elementRef.nativeElement as HTMLElement).style.display = 'absolute';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.cdr.markForCheck();
  }
}
