import { Component, OnInit, ElementRef } from '@angular/core';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../shared/services';
import { environment } from 'src/environments/environment';
import { LoginModel } from 'src/app/shared/models/login-model';

interface RouteInfo {
  id: number;
  path: string;
  title: string;
  icon: string;
  class: string;
}

interface SubRouteInfo extends RouteInfo {
  routeId: number;
}

export const ROUTES: RouteInfo[] = [
  {
    id: 1,
    path: '/admin',
    title: 'Dashboard',
    icon: 'ni-tv-2 text-primary',
    class: '',
  },
  {
    id: 2,
    path: '/admin/staff-desk',
    title: 'My Desk',
    icon: 'ni-planet text-info',
    class: '',
  },
  {
    id: 3,
    path: '#',
    title: 'Application(s)',
    icon: 'ni-pin-3 text-success',
    class: '',
  },
  {
    id: 4,
    path: '/admin/settings',
    title: 'Settings',
    icon: 'fa fa-cog text-default',
    class: '',
  },
  {
    id: 5,
    path: '/tables',
    title: 'Tables',
    icon: 'ni-bullet-list-67 text-red',
    class: '',
  },
  {
    id: 6,
    path: '/login',
    title: 'Login',
    icon: 'ni-key-25 text-info',
    class: '',
  },
  {
    id: 7,
    path: '/register',
    title: 'Register',
    icon: 'ni-circle-08 text-pink',
    class: '',
  },
];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  public user: LoginModel;
  generic: GenericService;

  constructor(
    location: Location,
    private auth: AuthenticationService,
    private element: ElementRef,
    private router: Router
  ) {
    this.location = location;
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  logout(): void {
    this.auth.logout();
    window.location.href = environment.apiUrl + '/auth/log-out';
  }
}
