import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';

import { environment } from '../../../../src/environments/environment';
import { tokenNotExpired } from '../../../../src/app/helpers/tokenUtils';
import { LoginModel } from '../models/login-model';
import { Directorate, UserRole } from '../constants/userRole';
import { LOCATION } from '../constants/location';
import { SpinnerService } from './spinner.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUser$ = new Subject<any>();
  private num = 2;
  public code = '6x0x5x1x';
  private _isLoggedIn = false;
  private _isLoggedIn$ = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private spinner: SpinnerService,
  ) {}

  public get currentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  login(
    userId: string // email: string, code: string
  ) {
    return this.http
      .get<any>(`${environment.apiUrl}/auth/validate-user?id=${userId}`)
      .pipe(
        retry(this.num),
        map((res) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (res.statusCode !== 200) {
            return null;
          }

          const user = res.data;
          const token = user.token;

          if (!token) return null;

          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', JSON.stringify(token));

          this._isLoggedIn = true;
          this._isLoggedIn$.next(true);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    // this.currentUserSubject.next(null);
    this._isLoggedIn = false;

    this.spinner.show('Logging you out...');    
    window.location.assign(`${environment.apiUrl}/account/logout`);
  }

  public get isCompany() {
    const user = this.currentUser as LoginModel;
    if (user?.userRoles == UserRole.COMPANY) return true;
    else return false;
  }

  public get isSupervisor() {
    return (this.currentUser as LoginModel)?.userRoles === UserRole.SUPERVISOR;
  }

  public get isSuperAdmin() {
    return (this.currentUser as LoginModel)?.userRoles === UserRole.SUPERADMIN;
  }

  public get isFAD() {
    return (this.currentUser as LoginModel)?.userRoles === UserRole.FAD;
  }

  public get isCOQProcessor() {
    return (this.currentUser as LoginModel)?.userRoles === UserRole.CONTROLLER
      || (this.currentUser as LoginModel)?.userRoles === UserRole.FAD;
  }

  public get isFO() {
    return (this.currentUser as LoginModel).location === LOCATION.FO;
  }

  public get isApprover() {
    return (this.currentUser as LoginModel)?.userRoles === UserRole.APPROVER;
  }

  public get isFieldOfficer() {
    return (this.currentUser as LoginModel)?.userRoles == UserRole.FIELDOFFICER;
  }

  public get isHppitiStaff() {
    return (this.currentUser as LoginModel).directorate === Directorate.HPPITI;
  }

  public get isDssriStaff() {
    return (this.currentUser as LoginModel).directorate === Directorate.DSSRI;
  }

  public get isStaff() {
    const user = this.currentUser as LoginModel;
    if (user?.userRoles != UserRole.COMPANY) return true;
    else return false;
  }

  public get isFOLocation() {
    const user = this.currentUser as LoginModel;
    if (user.location == LOCATION.FO) return true;
    else return false;
  }

  public get isLoggedIn() {
    return tokenNotExpired();
  }

  getStaffDashboard() {
    return this.http
      .get<any>(`${environment.apiUrl}/Staff/get-dashboard`, {})
      .pipe(
        retry(this.num),
        map((res) => {
          return res;
        })
      );
  }

  getStaffDesk() {
    return this.http
      .get<any>(`${environment.apiUrl}/Application/my-desk`, {})
      .pipe(
        retry(this.num),
        map((res) => {
          return res;
        })
      );
  }

  getAllStaff() {
    return this.http.get<any>(`${environment.apiUrl}/Staff/all-users`, {}).pipe(
      retry(this.num),
      map((res) => {
        return res;
      })
    );
  }

  getElpsStaffList() {
    return this.http
      .get<any>(`${environment.apiUrl}/account/all-elps-staff`, {})
      .pipe(
        retry(this.num),
        map((res) => {
          return res;
        })
      );
  }

  getRoles() {
    return this.http
      .get<any>(`${environment.apiUrl}/account/all-staff-roles`, {})
      .pipe(
        retry(this.num),
        map((res) => {
          return res;
        })
      );
  }

  getCOMPANYResource(COMPANYCode: string) {
    return this.http
      .get<any>(`${environment.apiUrl}/account/getCOMPANYResource`, {
        params: { COMPANYCode: COMPANYCode },
      })
      .pipe(retry(this.num));
  }

  addStaff(model: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/add-staff`, model)
      .pipe(retry(this.num));
  }

  getPhaseCategories() {
    return this.http
      .get<any>(`${environment.apiUrl}/configuration/get-permit-configuration`)
      .pipe(retry(this.num));
  }

  createModule(model: any) {
    return this.http
      .post<any>(
        `${environment.apiUrl}/configuration/post-module-configuration`,
        model
      )
      .pipe(retry(this.num));
  }

  createPhase(model: any) {
    return this.http
      .post<any>(
        `${environment.apiUrl}/configuration/post-permit-configuration`,
        model
      )
      .pipe(retry(this.num));
  }

  getOffices() {
    return this.http
      .get<any>(`${environment.apiUrl}/configuration/field-offices`)
      .pipe(retry(this.num));
  }

  addFieldOffice(model: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/configuration/add-field-office`, model)
      .pipe(retry(this.num));
  }

  submitPayment(rrr: string) {
    return this.http.get<any>(`${environment.apiUrl}/auth/pay-online`, {
      params: { rrr },
    });
  }
}
