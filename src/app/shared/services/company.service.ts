import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, map } from 'rxjs/operators';
import { IPlant } from '../../../../src/app/company/settings/processing-plant/processing-plant.component';
import { environment } from '../../../../src/environments/environment';
import { ITank } from '../interfaces/ITank';

const API = `${environment.apiUrl}/company`;
@Injectable({ providedIn: 'root' })
export class CompanyService {
  private num = 2;

  constructor(private http: HttpClient) {}

  getCompanyApplications() {
    return this.http.get<any>(`${API}/my-apps`).pipe();
  }

  public getUploadDocuments(appId: number) {
    return this.http.get<any>(
      `${environment.apiUrl}/application/document-upload`,
      {
        params: { id: appId },
      }
    );
  }

  public updateCompanyProfile(data) {
    return this.http.post<any>(
      `${environment.apiUrl}/Company/update-profile`,
      data
    );
  }

  public getCompanyProfile(email) {
    return this.http.get<any>(`${environment.apiUrl}/Company/get-profile`, {
      params: { email: email },
    });
  }

  public getcompanyPlants() {
    return this.http.get<any>(
      `${environment.apiUrl}/Plant/get-all-PlantsByCompany`
    );
  }

  public addPlant(data: IPlant) {
    return this.http
      .post<any>(`${environment.apiUrl}/Plant/add-processing-plant`, data)
      .pipe(retry(this.num));
  }

  public editPlant(id: number, data: IPlant) {
    return this.http
      .put<any>(`${environment.apiUrl}/Plant/edit-plant/${id}`, data)
      .pipe(retry(this.num));
  }

  public getPlantById(id: IPlant) {
    return this.http
      .get<any>(`${environment.apiUrl}/Plant/get-plant/${id}`)
      .pipe(retry(this.num));
  }

  public deletePlant(id: IPlant) {
    return this.http
      .delete<any>(`${environment.apiUrl}/Plant/delete-plant?id=${id}`)
      .pipe(retry(this.num));
  }

  getcompanytanks(plantId: Number) {
    return this.http.get<any>(
      `${environment.apiUrl}/Plant/get-all-Tanks?plantId=${plantId}`
    );
  }

  public addTank(data: ITank) {
    return this.http
      .post<any>(
        `${environment.apiUrl}/Plant/add-plantTank?id=${data.plantId}`,
        data
      )
      .pipe(retry(this.num));
  }

  public editTank(data: any) {
    return this.http
      .put<any>(`${environment.apiUrl}/Plant/edit-plantTank/${data.id}`, data)
      .pipe(retry(this.num));
  }

  public deleteTank(id: IPlant) {
    return this.http
      .delete<any>(`${environment.apiUrl}/Plant/delete-plantTank?id=${id}`)
      .pipe(retry(this.num));
  }

  getCountries() {
    return this.http.get<any>(`${environment.apiUrl}/Library/Countries`).pipe(
      retry(this.num),
      map((res) => {
        return res;
      })
    );
  }

  getStates() {
    return this.http
      .get<any>(`${environment.apiUrl}/Library/StatesInNigeria`)
      .pipe(
        retry(this.num),
        map((res) => {
          return res;
        })
      );
  }

  public getproducts() {
    return this.http
      .get<any>(`${environment.apiUrl}/Product/all-products`)
      .pipe(retry(this.num));
  }

  public getCompanyDashboard() {
    return this.http.get<any>(`${API}/dashboard`);
  }

  public getCompanyMessages() {
    return this.http.get<any>(`${API}/get-all-message`);
  }

  public getMessagesById(id: number) {
    return this.http.get<any>(`${API}/Get-Message-ById?id=${id}`);
  }

  public getOperatingFacilities() {
    return this.http.get<any>(`${API}/OperatingFacilities`);
  }
}
