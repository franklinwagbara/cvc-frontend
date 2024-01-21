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
import { LOCATION } from 'src/app/shared/constants/location';
import { Directorate, UserRole } from 'src/app/shared/constants/userRole';

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
        url: '/admin/desk',
      },
    ],
  },
  {
    id: 4,
    title: 'APPLICATIONS',
    iconName: 'apps',
    iconId: 'apps',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'NoA APPLICATIONS',
        url: '/admin/applications/noa-applications',
      },
      {
        id: 2,
        title: 'CoQ APPLICATIONS',
        url: '/admin/applications/coq-applications',
      },
    ],
  },
  {
    id: 5,
    title: 'ALL APPROVALS',
    iconName: 'licence-outline',
    iconId: 'licence_outline',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'CoQ CERTIFICATES',
        url: '/admin/all-approvals/coq-certificates',
      },
      {
        id: 2,
        title: 'NoA CLEARANCES',
        url: '/admin/all-approvals/noa-clearances',
      },
    ],
  },
  {
    id: 6,
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
    ],
  },
  {
    id: 7,
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
        url: '/admin/reports/application-report',
      },
      {
        id: 2,
        title: 'CLEARANCE REPORT',
        url: '#',
      },
      {
        id: 3,
        title: 'PAYMENT REPORT',
        url: '/admin/reports/payment-report',
      },
    ],
  },
  {
    id: 8,
    title: 'SETTINGS',
    iconName: 'setting',
    iconId: 'setting',
    iconColor: 'white',
    active: false,
    subMenuActive: false,

    subRoutes: [
      {
        id: 1,
        title: 'USERS',
        url: '/admin/settings/all-staff',
      },
      {
        id: 2,
        title: 'MODULES',
        url: '/admin/settings/modules',
      },
      {
        id: 3,
        title: 'APPPLICATION STAGE DOCS',
        url: '/admin/settings/application-stage-docs',
      },
      {
        id: 4,
        title: 'FIELD/ZONAL OFFICES',
        url: '/admin/settings/field-zone-office',
      },
      {
        id: 5,
        title: 'BRANCHES',
        url: '/admin/settings/branches',
      },
      {
        id: 6,
        title: 'APPLICATION PROCESS',
        url: '/admin/settings/application-process',
      },
      {
        id: 7,
        title: 'FIELD/DEPOT OFFICER',
        url: '/admin/settings/field-officer',
      },
      {
        id: 8,
        title: 'APPLICATION FEES',
        url: '/admin/settings/app-fees',
      },
      {
        id: 9,
        title: 'APPLICATION DEPOTS',
        url: '/admin/settings/app-depots',
      },
      {
        id: 10,
        title: 'JETTY',
        url: '/admin/settings/jetty',
      },
      {
        id: 11,
        title: 'NOMINATED SURVEYORS',
        url: '/admin/settings/nominated-surveyors',
      },
      {
        id: 12,
        title: 'ROLES',
        url: '/admin/settings/roles',
      },
      {
        id: 13,
        title: 'PRODUCTS',
        url: '/admin/settings/products',
      },
      {
        id: 11,
        title: 'EMAIL CONFIGURATION',
        url: '/admin/settings/email-config',
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
  public Directorate = Directorate;
  public directorate: string;

  isCollapsed = false;
  @Input() isCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pageManagerService: PageManagerService
  ) {
    this.menuItems = [...ROUTES];

    const currentUser = decodeFullUserInfo();
    this.directorate = currentUser.directorate;

    // Show CoQ nav only to Staffs in Field Offices and Field Officers
    if (currentUser.userRoles === UserRole.FIELDOFFICER) {
      let coqSubRoutes = [
        {
          id: 1,
          title: 'NoA Applications',
          url: '/admin/coq-and-plant/noa-applications-by-depot',
        },
        {
          id: 2,
          title: 'CoQ Applications',
          url: '/admin/coq-and-plant/coq-applications-by-depot',
        },
      ];

      if (currentUser.userRoles === UserRole.FIELDOFFICER) {
        coqSubRoutes.push({
          id: 3,
          title: 'Processing Plant',
          url: '/admin/coq-and-plant/processing-plant/certificate-of-quantity/new-application',
        });
      }

      this.menuItems = this.menuItems.slice(0, 2).concat(
        {
          id: 3,
          title: 'CoQ And Plant',
          iconName: 'carbon',
          iconId: 'carbon',
          iconColor: 'white',
          active: false,
          subMenuActive: false,
          subRoutes: coqSubRoutes,
        },
        this.menuItems.slice(2)
      );
    }
    // else {
    //   let coqSubRoutes = [
    //     {
    //       id: 3,
    //       title: 'Processing Plant',
    //       url: '/admin/coq-and-plant/processing-plant/certificate-of-quantity/new-application',

    //     },
    //     {
    //       id: 2,
    //       title: 'CoQ Applications',
    //       url: '/admin/coq-and-plant/coq-applications-by-depot',
    //     },
    //   ];

    //   this.menuItems = this.menuItems.slice(0, 2).concat(
    //     {
    //       id: 3,
    //       title: 'CoQ And Plant',
    //       iconName: 'carbon',
    //       iconId: 'carbon',
    //       iconColor: 'white',
    //       active: false,
    //       subMenuActive: false,
    //       subRoutes: coqSubRoutes,
    //     },
    //     this.menuItems.slice(2)
    //   );
    // }

    // Show NOA Applications and All Applications only to Admins and HQ staffs
    if (
      !Util.adminRoles.includes(currentUser?.userRoles) &&
      currentUser?.location !== 'HQ'
    ) {
      this.menuItems = this.menuItems.filter(
        (item) =>
          item.title !== 'NOA APPLICATIONS' && item.title !== 'APPLICATIONS'
      );
    }

    // Show settings only SuperAdmin
    if (!Util.adminRoles.includes(currentUser?.userRoles)) {
      this.menuItems = this.menuItems.filter(
        (item) => item.title !== 'SETTINGS'
      );
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.menuItems.find(
          (r) =>
            r.title.toLowerCase() ===
            this.router.url.replace(/-/g, ' ').split('/')[2]
        );
        if (route) {
          route.active = true;
          route.subMenuActive = true;
        }
      });
  }

  ngOnInit() {
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
