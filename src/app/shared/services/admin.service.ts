import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';

import { environment } from '../../../../src/environments/environment';
import { LoginModel } from '../models/login-model';
import { IApplicationProcess } from '../interfaces/IApplicationProcess';
import { Schedule } from '../reusable-components/add-schedule-form/add-schedule-form.component';
import { IAppFee } from '../../../../src/app/company/apply/new-application/new-application.component';
import { IRole } from '../interfaces/IRole';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private currentUserSubject: BehaviorSubject<LoginModel>;
  public currentUser: Observable<LoginModel>;
  private num = 2;
  public code = '6x0x5x1x';
  public isLoggedIn = false;

  constructor(private http: HttpClient) {
    // if(localStorage.getItem('currentUser') != null){
    //     this.currentUserSubject = new BehaviorSubject<LoginModel>(JSON.parse(localStorage.getItem('currentUser')));
    //     this.currentUser = this.currentUserSubject.asObservable();
    // }
    this.currentUserSubject = new BehaviorSubject<LoginModel>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoginModel {
    return this.currentUserSubject.value;
  }

  login(email: string, code: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/login`, '', {
        params: { email: email, code: code },
      })
      .pipe(
        retry(this.num),
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.data));
          //localStorage.setItem('iden', user.id);
          this.currentUserSubject.next(user.data);
          this.isLoggedIn = true;
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    //localStorage.removeItem('iden');
    this.currentUserSubject.next(null);
    this.isLoggedIn = false;
  }

  createStaff(model) {
    return this.http.post<any>(`${environment.apiUrl}/Staff/add-user`, model);
  }

  updateStaff(model) {
    return this.http.put<any>(
      `${environment.apiUrl}/account/edit-staff`,
      model
    );
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
      .get<any>(`${environment.apiUrl}/admin/get-staff-desk`, {})
      .pipe(
        retry(this.num),
        map((res) => {
          return res;
        })
      );
  }

  getApplicationsOnStaffDeskById(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/admin/get-staffdesk-by-id`,
      { params: { id } }
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

  deleteStaff(id: number) {
    return this.http.delete<any>(
      `${environment.apiUrl}/Staff/Delete-User?id=${id}`,
      {}
    );
  }

  getElpsStaffList() {
    return this.http
      .get<any>(`${environment.apiUrl}/Staff/get-staffby-elpsId`, {})
      .pipe(
        retry(this.num),
        map((res) => {
          return res;
        })
      );
  }

  getRoles() {
    // return this.http.get<any>(`${environment.apiUrl}/Library/Roles`, {}).pipe(
    return this.http.get<any>(`${environment.apiUrl}/Role/get-roles`).pipe(
      retry(this.num),
      map((res) => {
        return res;
      })
    );
  }

  addRoles(data: IRole) {
    return this.http
      .post<any>(`${environment.apiUrl}/Role/add-role`, data)
      .pipe(
        retry(this.num),
        map((res) => {
          return res;
        })
      );
  }

  editRoles(data: IRole) {
    return this.http
      .post<any>(`${environment.apiUrl}/Role/edit-role`, data)
      .pipe(
        retry(this.num),
        map((res) => {
          return res;
        })
      );
  }

  deleteRoles(id: any) {
    return this.http
      .delete<any>(`${environment.apiUrl}/Role/delete-role?id=${id}`)
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
      .post<any>(`${environment.apiUrl}/Staff/add-user`, model)
      .pipe(retry(this.num));
  }

  getPhaseCategories() {
    return this.http
      .get<any>(`${environment.apiUrl}/configuration/get-permit-configuration`)
      .pipe(retry(this.num));
  }

  getPayments() {
    return this.http
      .get<any>(`${environment.apiUrl}/Payment/pay-online`)
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

  getModule() {
    return this.http
      .get<any>(`${environment.apiUrl}/configuration/get-module-configuration`)
      .pipe(retry(this.num));
  }

  deleteModule(moduleId: number) {
    return this.http
      .delete<any>(
        `${environment.apiUrl}/configuration/delete-module-configuration?id=${moduleId}`
      )
      .pipe(retry(this.num));
  }

  editModule(model) {
    return this.http
      .put<any>(
        `${environment.apiUrl}/configuration/update-module-configuration`,
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
      .pipe(
        retry(this.num),
        map((res) => res)
      );
  }

  editPhase(model: any) {
    return this.http
      .put<any>(
        `${environment.apiUrl}/configuration/update-permit-configuration`,
        model
      )
      .pipe(retry(this.num));
  }

  deletePhase(id: number) {
    return this.http
      .delete<any>(
        `${environment.apiUrl}/configuration/delete-permit-configuration`,
        {
          params: { permitID: id },
        }
      )
      .pipe(retry(this.num));
  }

  createPermitStage(model: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/configuration/post-permit-stage`, model)
      .pipe(
        retry(this.num),
        map((res) => res)
      );
  }

  editPermitStage(model: any) {
    return this.http
      .put<any>(
        `${environment.apiUrl}/configuration/update-permit-stage`,
        model
      )
      .pipe(retry(this.num));
  }

  deletePermitStage(id: number) {
    return this.http
      .delete<any>(
        `${environment.apiUrl}/configuration/delete-permit-stage?id=${id}`
      )
      .pipe(retry(this.num));
  }

  createStageDocs(model: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/Library/Create-FacilityType-Doc`,
      model
    );
  }

  rerouteApplication(model: {
    newStaffId: string;
    oldStaffId: string;
    comment: string;
    apps: number[];
  }) {
    return this.http.put<any>(
      `${environment.apiUrl}/admin/reroute-application`,
      model
    );
  }

  assignApplication(model: {
    newStaffId: string;
    oldStaffId: string;
    comment: string;
    apps: number[];
  }) {
    return this.http.put<any>(
      `${environment.apiUrl}/admin/assign-application`,
      model
    );
  }

  getAppTypes() {
    return this.http
      .get<any>(
        `${environment.apiUrl}/configuration/app type route not defined yet`
      )
      .pipe(retry(this.num));
  }

  getOffices() {
    return this.http
      .get<any>(`${environment.apiUrl}/Library/All-Offices`)
      .pipe(retry(this.num));
  }

  createOffice(model) {
    return this.http
      .post<any>(`${environment.apiUrl}/configuration/add-field-office`, model)
      .pipe(retry(this.num));
  }

  deleteOffice(id: number) {
    return this.http
      .delete<any>(
        `${environment.apiUrl}/configuration/delete-field-office?id=${id}`
      )
      .pipe(retry(this.num));
  }

  addFieldOffice(model: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/configuration/add-field-office`, model)
      .pipe(retry(this.num));
  }

  getBranches() {
    return this.http
      .get<any>(`${environment.apiUrl}/Library/All-Locations`)
      .pipe(retry(this.num));
  }

  createBranch(model) {
    return this.http
      .post<any>(`${environment.apiUrl}/configuration/add-branch`, model)
      .pipe(retry(this.num));
  }

  deleteBranch(id: number) {
    return this.http
      .delete<any>(`${environment.apiUrl}/configuration/delete-branch?id=${id}`)
      .pipe(retry(this.num));
  }

  getApps() {
    return this.http
      .get<any>(`${environment.apiUrl}/Application/all-applications`)
      .pipe(retry(this.num));
  }

  getActionsAndStatuses() {
    return this.http
      .get<any>(`${environment.apiUrl}/configuration/all-actions-status`)
      .pipe(retry(this.num));
  }

  getStaffsForRerouteApplication(id: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/admin/reroute-application-Dropdownlist`,
      { params: { id } }
    );
  }

  addSchedule(model: Schedule) {
    return this.http.post<any>(
      `${environment.apiUrl}/admin/schedule-meeting`,
      model
    );
  }

  editSchedule(model: Schedule) {
    return this.http.post<any>(
      `${environment.apiUrl}/admin/schedule-meeting`,
      model
    );
  }

  public getAppFees() {
    return this.http
      .get<any>(`${environment.apiUrl}/AppFee/get-all-fees`)
      .pipe(retry(this.num));
  }

  public addAppFees(data: IAppFee) {
    return this.http
      .post<any>(`${environment.apiUrl}/AppFee/add-fee`, data)
      .pipe(retry(this.num));
  }

  public editAppFees(data: IAppFee) {
    return this.http
      .put<any>(`${environment.apiUrl}/AppFee/edit-fee`, data)
      .pipe(retry(this.num));
  }

  public getAppFeeById(id: IAppFee) {
    return this.http
      .get<any>(`${environment.apiUrl}/AppFee/get-fee-byId?id=${id}`)
      .pipe(retry(this.num));
  }

  public deleteAppFee(id: IAppFee) {
    return this.http
      .delete<any>(`${environment.apiUrl}/AppFee/delete-fee?id=${id}`)
      .pipe(retry(this.num));
  }

  public getproductTypes() {
    return this.http
      .get<any>(`${environment.apiUrl}/Product/all-product-types`)
      .pipe(retry(this.num));
  }

  public getproducts() {
    return this.http
      .get<any>(`${environment.apiUrl}/Product/all-products`)
      .pipe(retry(this.num));
  }

  public addproducts(data: IAppFee) {
    return this.http
      .post<any>(`${environment.apiUrl}/Product/create-products`, data)
      .pipe(retry(this.num));
  }

  public editproducts(data: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/Product/edit-products`, data)
      .pipe(retry(this.num));
  }

  public getproductsById(id: IAppFee) {
    return this.http
      .get<any>(`${environment.apiUrl}/AppFee/get-product-byId?id=${id}`)
      .pipe(retry(this.num));
  }

  public deleteproducts(id: IAppFee) {
    return this.http
      .delete<any>(`${environment.apiUrl}/AppFee/delete-fee?id=${id}`)
      .pipe(retry(this.num));
  }
}
