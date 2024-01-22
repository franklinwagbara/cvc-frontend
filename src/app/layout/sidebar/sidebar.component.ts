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
import { UserRole } from 'src/app/shared/constants/userRole';
import { LoginModel } from 'src/app/shared/models/login-model';
import { AuthenticationService } from 'src/app/shared/services';

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
    id: 5,
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
    id: 6,
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
        title: 'FIELD OFFICER / DEPOT',
        url: '/admin/settings/field-officer-depot',
      },
      {
        id: 8,
        title: 'FIELD OFFICER/JETTY',
        url: '/admin/settings/field-officer-jetty',
      },
      {
        id: 9,
        title: 'APPLICATION FEES',
        url: '/admin/settings/app-fees',
      },
      {
        id: 10,
        title: 'APPLICATION DEPOTS',
        url: '/admin/settings/app-depots',
      },
      {
        id: 11,
        title: 'JETTY',
        url: '/admin/settings/jetty',
      },
      {
        id: 12,
        title: 'NOMINATED SURVEYORS',
        url: '/admin/settings/nominated-surveyors',
      },
      {
        id: 13,
        title: 'ROLES',
        url: '/admin/settings/roles',
      },
      {
        id: 14,
        title: 'PRODUCTS',
        url: '/admin/settings/products',
      },
      {
        id: 15,
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
  currentUser: any;

  isCollapsed = false;
  @Input() isCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private pageManagerService: PageManagerService
  ) {
    this.menuItems = [...ROUTES];
    this.currentUser = this.auth.currentUser as LoginModel;

    if (this.currentUser.userRoles === UserRole.FIELDOFFICER) {
      this.menuItems = this.menuItems.slice(0, 2).concat(
        [
          {
            id: 3,
            title: 'VESSEL CLEARANCE',
            iconName: 'approval',
            iconId: 'approval',
            iconColor: 'white',
            active: false,
            subMenuActive: false,

            subRoutes: [
              {
                id: 1,
                title: 'DISCHARGE CLEARANCE',
                url: '/admin/vessel-clearance/noa-applications-by-jetty-officer',
              },
            ],
          },
        ],
        this.menuItems.slice(2)
      );
    }

    // Show CoQ And Plant tab only to Staffs in Field Offices and Field Officers
    if (this.auth.isFieldOfficer || this.auth.isFO) {
      let coqSubRoutes = [
        {
          id: 1,
          title: 'CoQ Applications',
          url: '/admin/coq-and-plant/coq-applications-by-depot',
        },
        {
          id: 2,
          title: 'Processing Plant',
          url: '/admin/coq-and-plant/processing-plant/certificate-of-quantity/new-application',
        },
      ];

      this.menuItems = this.menuItems.slice(0, 3).concat(
        {
          id: 4,
          title: 'CoQ And Plant',
          iconName: 'carbon',
          iconId: 'carbon',
          iconColor: 'white',
          active: false,
          subMenuActive: false,
          subRoutes: coqSubRoutes,
        },
        this.menuItems.slice(3)
      );
    }

    // Show NOA Applications and All Applications only to Admins and HQ staffs
    if (
      !Util.adminRoles.includes(this.currentUser?.userRoles) &&
      this.currentUser?.location !== LOCATION.HQ
    ) {
      this.menuItems = this.menuItems.filter(
        (item) =>
          item.title !== 'NOA APPLICATIONS' && item.title !== 'APPLICATIONS'
      );
    }

    // Show settings only SuperAdmin
    if (this.currentUser?.userRoles !== UserRole.SUPERADMIN) {
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
