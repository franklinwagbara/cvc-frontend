import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginModel } from 'src/app/shared/models/login-model';
import { AuthenticationService } from 'src/app/shared/services';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent implements OnInit {
  public menuOpen: boolean = true;
  public currentUserInfo: LoginModel;

  @Output() onMenuOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.currentUserInfo = this.authService.currentUser;
  }

  navToggle() {
    this.menuOpen = !this.menuOpen;
    this.onMenuOpen.emit(this.menuOpen);
  }

  logout() {
    this.authService.logout();
  }
}
