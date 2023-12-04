import {
  Component,
  OnInit,
  Input,
  Pipe,
  PipeTransform,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { PageManagerService } from 'src/app/shared/services/page-manager.service';

export interface SubRouteInfo {
  id: number;
  title: string;
  url: string;
}

export interface RouteInfo {
  id: number;
  title: string;
  active: boolean;
  subMenuActive: boolean;
  iconName: string;
  iconId: string;
  iconColor: string;
  subRoutes: SubRouteInfo[];
}

const ROUTES: RouteInfo[] = [
  {
    id: 1,
    title: 'DASHBOARD',
    iconName: 'dashboard',
    iconId: 'dashboard',
    iconColor: 'white',
    active: true,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'DASHBOARD',
        url: '/admin',
      },
    ],
  },
  {
    id: 2,
    title: 'DESK',
    iconName: 'app-desk',
    iconId: 'app_desk',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'MY DESK',
        url: '/admin/my-desk',
      },
      // {
      //   id: 2,
      //   title: 'STAFF DESK',
      //   url: '/admin/staff-desk',
      // },
    ],
  },
  {
    id: 3,
    title: 'APPLICATIONS',
    iconName: 'apps',
    iconId: 'dashboard_outline',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'ALL APPLICATIONS',
        url: '/admin/all-applications',
      },
    ],
  },
  {
    id: 3,
    title: 'LICENCES',
    iconName: 'licence-outline',
    iconId: 'licence_outline',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'ALL LICENCES',
        url: '/admin/licences',
      },
    ],
  },
  {
    id: 3,
    title: 'SCHEDULES',
    iconName: 'schedules',
    iconId: 'schedules',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'ALL SCHEDULES',
        url: '/admin/schedules',
      },
    ],
  },
  {
    id: 4,
    title: 'PAYMENTS',
    iconName: 'payment',
    iconId: 'payment_fluent',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'ALL PAYMENTS',
        url: '#',
      },
      {
        id: 2,
        title: 'EXTRA PAYMENTS',
        url: '#',
      },
    ],
  },
  {
    id: 5,
    title: 'REPORTS',
    iconName: 'treatment',
    iconId: 'Layer_1',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'APPLICATION REPORT',
        url: '/admin/application-report',
      },
      {
        id: 2,
        title: 'PERMIT REPORT',
        url: '#',
      },
      {
        id: 3,
        title: 'PAYMENT REPORT',
        url: '/admin/payment-report',
      },
    ],
  },
  {
    id: 6,
    title: 'SETTINGS',
    iconName: 'setting',
    iconId: 'setting',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'USER SETUP',
        url: '/admin/all-staff',
      },
      {
        id: 2,
        title: 'MODULE SETTINGS',
        url: '/admin/modules-setting',
      },
      {
        id: 3,
        title: 'APPPLICATION STAGE DOCS',
        url: '/admin/application-stage-docs',
      },
      {
        id: 4,
        title: 'FIELD/ZONAL OFFICES',
        url: '/admin/field-zone-office',
      },
      {
        id: 5,
        title: 'BRANCHES SETUP',
        url: '/admin/branch-setting',
      },
      {
        id: 6,
        title: 'APPLICATION PROCESS',
        url: '/admin/application-process',
      },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  user: any[];
  public menuItems: RouteInfo[];
  public submenuItems: SubRouteInfo[];
  public activeNavItem = 'DASHBOARD';
  public isSubMenuCollapsed = true;

  @Input() isCollapsed = false;

  constructor(
    private router: Router,
    private pageManagerService: PageManagerService
  ) {}

  ngOnInit() {
    this.menuItems = [...ROUTES];
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  setActiveNavItem(navItem: string) {
    this.activeNavItem = navItem;
    this.menuItems = this.menuItems.map((menu) => {
      if (menu.title === navItem) {
        menu.active = true;
        menu.subMenuActive = true;
      } else {
        menu.active = false;
        menu.subMenuActive = false;
      }

      return menu;
    });
    this.menuItems = [...this.menuItems];
  }

  @HostListener('mouseover', ['$event'])
  onMouseover(event: Event) {
    if (!this.pageManagerService.adminSidebarMenuOpen) {
      this.isCollapsed = false;
      this.pageManagerService.adminSidebarHover.emit(true);
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: Event) {
    if (!this.pageManagerService.adminSidebarMenuOpen) {
      this.isCollapsed = true;
      this.pageManagerService.adminSidebarHover.emit(false);
    }
  }
}
