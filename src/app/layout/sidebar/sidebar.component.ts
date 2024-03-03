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
import { PageManagerService } from '../../../../src/app/shared/services/page-manager.service';
import { Util } from '../../../../src/app/shared/lib/Util';
import { Directorate, UserRole } from 'src/app/shared/constants/userRole';
import { LoginModel } from 'src/app/shared/models/login-model';
import { AuthenticationService } from 'src/app/shared/services';
import { LOCATION } from 'src/app/shared/constants/location';

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
  directorate: 'HPPITI' | 'DSSRI' | 'BOTH';
  userRole: UserRole[];
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
    directorate: 'BOTH',
    userRole: [UserRole.ALL],

    subRoutes: [
      {
        id: 1,
        title: 'DASHBOARD',
        url: '/admin/dashboard',
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
    directorate: 'BOTH',
    userRole: [UserRole.ALL],

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
    directorate: 'DSSRI',
    userRole: [UserRole.ALL],

    subRoutes: [
      {
        id: 1,
        title: 'NoA APPLICATIONS',
        url: '/admin/applications/noa-applications',
      },
      {
        id: 2,
        title: 'STS APPLICATIONS',
        url: '/admin/applications/sts-applications',
      },
      {
        id: 3,
        title: 'CoQ APPLICATIONS',
        url: '/admin/applications/coq-applications',
      },
    ],
  },
  {
    id: 6,
    title: 'CoQ',
    iconName: 'carbon',
    iconId: 'carbon',
    iconColor: 'white',
    active: false,
    subMenuActive: false,
    directorate: 'BOTH',
    userRole: [UserRole.ALL],
    subRoutes: [
      {
        id: 1,
        title: 'My Depot(s) CoQs',
        url: '/admin/coq/coq-applications-by-depot',
      },
    ],
  },
  {
    id: 7,
    title: 'ALL APPROVALS',
    iconName: 'licence-outline',
    iconId: 'licence_outline',
    iconColor: 'white',
    active: false,
    subMenuActive: false,
    directorate: 'BOTH',
    userRole: [UserRole.ALL],

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
    id: 8,
    title: 'PROCESSING PLANT',
    iconName: 'carbon',
    iconId: 'carbon',
    iconColor: 'white',
    active: false,
    subMenuActive: false,
    directorate: 'BOTH',
    userRole: [UserRole.ALL],
    subRoutes: [
      {
        id: 2,
        title: 'CoQ Form',
        url: '/admin/processing-plant/certificate-of-quantity/new-application',
      },
      {
        id: 1,
        title: 'My CoQ Applications',
        url: '/admin/processing-plant/certificate-of-quantity/applications',
      },
    ],
  },

  {
    id: 9,
    title: 'PAYMENTS',
    iconName: 'payment',
    iconId: 'payment_fluent',
    iconColor: 'white',
    active: false,
    subMenuActive: false,
    directorate: 'BOTH',
    userRole: [UserRole.ALL],

    subRoutes: [
      {
        id: 1,
        title: 'ALL PAYMENTS',
        url: '/admin/payments',
      },
    ],
  },
  {
    id: 10,
    title: 'REPORTS',
    iconName: 'treatment',
    iconId: 'Layer_1',
    iconColor: 'white',
    active: false,
    subMenuActive: false,
    directorate: 'BOTH',
    userRole: [UserRole.ALL],

    subRoutes: [
      {
        id: 1,
        title: 'APPLICATION REPORT',
        url: '/admin/reports/application-report',
      },
      {
        id: 2,
        title: 'CLEARANCE REPORT',
        url: '/admin/reports/clearance-report',
      },
      {
        id: 3,
        title: 'PAYMENT REPORT',
        url: '/admin/reports/payment-report',
      },
    ],
  },
  {
    id: 11,
    title: 'SETTINGS',
    iconName: 'setting',
    iconId: 'setting',
    iconColor: 'white',
    active: false,
    subMenuActive: false,
    directorate: 'BOTH',
    userRole: [UserRole.ALL],

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
        title: 'FIELD OFFICER / JETTY',
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
      {
        id: 17,
        title: 'METER TYPE CONFIGURATION',
        url: '/admin/settings/meter-types',
      },
      {
        id: 18,
        title: 'DIP METHOD CONFIGURATION',
        url: '/admin/settings/dip-method',
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

    if (
      this.currentUser?.userRoles === UserRole.FIELDOFFICER &&
      this.currentUser?.directorate === Directorate.DSSRI
    ) {
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
            directorate: 'BOTH',
            userRole: [UserRole.ALL],

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

    // Show CoQ nav only to DSSRI Field Officers
    if (!(auth.isDssriStaff && auth.isFieldOfficer)) {
      this.menuItems = this.menuItems.filter((el) => el.title !== 'CoQ');
    }

    // Show Processing Plant nav only HPPITI Field Officers
    if (!(auth.isHppitiStaff && auth.isFieldOfficer)) {
      this.menuItems = this.menuItems.filter((el) => el.title !== 'PROCESSING PLANT');
    }

    if (auth.isDssriStaff || !auth.currentUser.directorate) {
      this.menuItems = this.menuItems.filter((item) => item.title !== 'PROCESSING PLANT');
    }

    if (auth.isHppitiStaff) {
      let allApprovalsNav = this.menuItems.find((el) => el.title === 'ALL APPROVALS');
      allApprovalsNav.subRoutes = allApprovalsNav.subRoutes.filter((el) => {
        return el.title !== 'NoA CLEARANCES';
      });
      let applicationsNav = this.menuItems.find(
        (item) => item.title === 'APPLICATIONS'
      );
      if (applicationsNav) {
        applicationsNav.subRoutes = applicationsNav.subRoutes.filter((el) => {
          return el.title === 'CoQ APPLICATIONS';
        });
      }
    }

    // Show settings if SuperAdmin
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
