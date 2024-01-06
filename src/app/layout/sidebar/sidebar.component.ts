import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { decodeFullUserInfo } from '../../../../src/app/helpers/tokenUtils';
import { PageManagerService } from '../../../../src/app/shared/services/page-manager.service';
import { Util } from '../../../../src/app/shared/lib/Util';

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
    active: false,
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
    title: 'CoQ',
    iconName: 'carbon',
    iconId: 'carbon',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'NOA Applications',
        url: '/admin/noa-applications-by-depot',
      },
      {
        id: 2,
        title: 'COQ Applications',
        url: '/admin/certificate-of-quantity/coq-applications-by-depot',
      },
    ],
  },
  {
    id: 4,
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
    id: 5,
    title: 'NOA APPLICATIONS',
    iconName: 'licence-outline',
    iconId: 'licence_outline',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'ALL CERTIFICATES',
        url: '/admin/certificates',
      },
    ],
  },
  // {
  //   id: 6,
  //   title: 'SCHEDULES',
  //   iconName: 'schedules',
  //   iconId: 'schedules',
  //   iconColor: 'white',
  //   active: false,
  //   subMenuActive: false,

  //   subRoutes: [
  //     {
  //       id: 1,
  //       title: 'ALL SCHEDULES',
  //       url: '/admin/schedules',
  //     },
  //   ],
  // },
  {
    id: 7,
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
        url: '/admin/payments',
      },
      {
        id: 2,
        title: 'EXTRA PAYMENTS',
        url: '#',
      },
    ],
  },
  {
    id: 8,
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
    id: 9,
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
      {
        id: 7,
        title: 'FIELD OFFICER SETUP',
        url: '/admin/field-officer-setting',
      },
      {
        id: 8,
        title: 'APPLICATION FEE',
        url: '/admin/app-fees',
      },
      {
        id: 9,
        title: 'APPLICATION DEPOT',
        url: '/admin/app-depots',
      },
      {
        id: 10,
        title: 'JETTY CONFIGURATION',
        url: '/admin/jetty-setting'
      },
      {
        id: 10,
        title: 'SURVEYOR CONFIGURATION',
        url: '/admin/nominated-surveyor-setting'
      },
      {
        id: 11,
        title: 'ROLE SETTINGS',
        url: '/admin/roles',
      },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnChanges {
  user: any[];
  public menuItems: RouteInfo[];
  public submenuItems: SubRouteInfo[];
  public activeNavItem = 'DASHBOARD';
  public isSubMenuCollapsed = true;

  isCollapsed = false;
  @Input() isCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pageManagerService: PageManagerService
  ) {
    this.menuItems = [...ROUTES];
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let foundActiveNav = false;
        for (let item of this.menuItems) {
          for (let subItem of item.subRoutes) {
            if (this.router.url === subItem.url) {
              item.active = true;
              item.subMenuActive = true;
              foundActiveNav = true;
              break;
            }
          }
          if (foundActiveNav) break;
        }
      });
  }

  ngOnInit() {
    const currentUser = decodeFullUserInfo();
    // Show CoQ nav only to Staffs in Field Offices
    if (!currentUser?.location || currentUser?.location !== 'FO') {
      this.menuItems = this.menuItems.filter((item) => item.title !== 'CoQ');
    }

    // Show NOA Applications and All Applications only to Admins and HQ staffs
    if (!Util.adminRoles.includes(currentUser?.userRoles) && currentUser?.location !== 'HQ') {
      this.menuItems = this.menuItems.filter((item) => item.title !== 'NOA APPLICATIONS' && item.title !== 'APPLICATIONS');
    }

    // Show settings only SuperAdmin
    if (!Util.adminRoles.includes(currentUser?.userRoles)) {
      this.menuItems = this.menuItems.filter((item) => item.title !== 'SETTINGS');
    }

    this.isCollapsed$.subscribe((val: boolean) => {
      this.isCollapsed = val;
      this.menuItems = this.menuItems.map((item) => {
        if (item.active) {
          return { ...item, subMenuActive: !val };
        }
        return item;
      });
    });
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnChanges(changes: SimpleChanges): void {}

  setActiveNavItem(navItem: string) {
    this.activeNavItem = navItem;
    this.menuItems = this.menuItems.map((menu) => {
      if (menu.title === navItem) {
        menu.active = true;
        menu.subMenuActive = true;
      }
      if (menu.title !== navItem) {
        let subMenuActive = menu.subRoutes.some(
          (val) => val.url === this.router.url
        );
        menu.active = subMenuActive;
        menu.subMenuActive = subMenuActive;
      }
      return menu;
    });
    this.menuItems = [...this.menuItems];
  }

  @HostListener('mouseover', ['$event'])
  onMouseover(event: MouseEvent) {
    if (!this.pageManagerService.adminSidebarMenuOpen) {
      this.isCollapsed = false;
      this.menuItems = this.menuItems.map((item) => {
        if (item.active) {
          return { ...item, subMenuActive: true };
        }
        return item;
      });
      this.pageManagerService.adminSidebarHover.emit(true);
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    if (!this.pageManagerService.adminSidebarMenuOpen) {
      this.isCollapsed = true;
      // Collapse active nav item
      this.menuItems = this.menuItems.map((item) => {
        if (item.active) {
          let isCurrentRoute = item.subRoutes.some(
            (val) => val.url === this.router.url
          );
          if (!isCurrentRoute) {
            return { ...item, active: false, subMenuActive: false };
          }
          return { ...item, subMenuActive: false };
        }
        return item;
      });
      this.pageManagerService.adminSidebarHover.emit(false);
    }
  }
}
