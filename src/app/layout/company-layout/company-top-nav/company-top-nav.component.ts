import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Subject } from 'rxjs';
import {
  Category,
  Phase,
} from 'src/app/admin/settings/modules-setting/modules-setting.component';
import { IMenuItem, ISubmenu } from 'src/app/shared/interfaces/menuItem';
import { LoginModel } from 'src/app/shared/models/login-model';
import { AuthenticationService } from 'src/app/shared/services';
import { ApplyService } from 'src/app/shared/services/apply.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-company-top-nav',
  templateUrl: './company-top-nav.component.html',
  styleUrls: ['./company-top-nav.component.scss'],
})
export class CompanyTopNavComponent implements OnInit {
  public categories$ = new Subject<Category[]>();
  public permitTypes$ = new Subject<Phase[]>();
  public categories: Category[];
  public permitTypes: Phase[];
  public currentUsername: LoginModel;

  currWindowWidth: number;

  public dashboardMenuItems: IMenuItem[] = [];
  public applicationsMenuItems: IMenuItem[] = [
    {
      name: 'Apply',
      url: 'company/apply',
      subMenu: [],
    },
    {
      name: 'My Application',
      url: 'company/myapplication',
      subMenu: null,
    },
  ];

  public myAccountMenuItems: IMenuItem[] = [
    {
      name: 'Company Profile',
      url: 'company/companyinformation',
      subMenu: null,
    },
    {
      name: 'Change Password',
      url: 'company/changepassword',
      subMenu: null,
    },
    {
      name: 'Messages',
      url: 'company/messages',
      subMenu: null,
    },
    {
      name: 'My Schedule',
      url: 'company/myschedule',
      subMenu: null,
    },
  ];

  public templateMenuItems = [
    {
      name: 'Download Template A',
      url: 'company/download-template-a',
      subMenu: null,
    },
    {
      name: 'Download Template B',
      url: 'company/download-template-b',
      subMenu: null,
    },
  ];

  constructor(
    private applyService: ApplyService,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    public auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    // this.getCategoriesAndPermitTypes();
    this.currWindowWidth = window.innerWidth;
    this.currentUsername = this.auth.currentUser;

    // this.categories$.subscribe((cats: Category[]) => {
    //   this.permitTypes$.subscribe((permitTypes) => {
    //     cats.forEach((cat) => {
    //       this.applicationsMenuItems[0].subMenu.push({
    //         name: cat.name,
    //         url: '',
    //         subMenu: ((): ISubmenu[] => {
    //           const subMenu: ISubmenu[] = [];

    //           permitTypes.forEach((p) => {
    //             if (p.categoryName === cat.name)
    //               subMenu.push({
    //                 name: p.code,
    //                 url: `company/apply/${cat.id}/${p.id}`,
    //                 subMenu: null,
    //               });
    //           });
    //           return subMenu;
    //         })(),
    //       });
    //     });
    //   });
    // });
  }

  getCategoriesAndPermitTypes() {
    this.spinner.open();

    forkJoin([
      this.applyService.getApplicationCategory(),
      this.applyService.getAllApplicationPhases(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) this.categories$.next(res[0].data.data);
        if (res[1].success) this.permitTypes$.next(res[1].data.data);

        this.spinner.close();
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Something went wrong while retrieving navigation data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.spinner.close();
      },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.currWindowWidth = window.innerWidth;
  }
}
