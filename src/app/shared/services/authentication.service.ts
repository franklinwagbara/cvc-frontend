import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tokenNotExpired } from 'src/app/helpers/tokenNotExpired';
import { LoginModel } from '../models/login-model';
import { UserRole } from '../constants/userRole';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUser$ = new Subject<any>();
  private num = 2;
  public code = '6x0x5x1x';
  private _isLoggedIn = false;
  private _isLoggedIn$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

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

    window.location.assign(`${environment.apiUrl}/auth/log-out`);
  }

  public get isCompany() {
    const user = this.currentUser as LoginModel;
    if (user.userRoles == UserRole.Company) return true;
    else return false;
  }

  public get isStaff() {
    const user = this.currentUser as LoginModel;
    if (user.userRoles != UserRole.Company) return true;
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

  getCompanyResource(companyCode: string) {
    return this.http
      .get<any>(`${environment.apiUrl}/account/getCompanyResource`, {
        params: { companyCode: companyCode },
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
