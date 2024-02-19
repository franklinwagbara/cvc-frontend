import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = `${environment.apiUrl}/ProcessingPlantCOQ`;

@Injectable({
  providedIn: 'root',
})
export class ProcessingPlantCOQService {
  constructor(private http: HttpClient) {}

  public createCoQ(
    payload: any,
    isGas: boolean,
    measurementType: 'Dynamic' | 'Static'
  ) {
    if (isGas) {
      if (measurementType == 'Dynamic')
        return this.createGasDynamicCoq(payload);
      else return this.createGasStaticCoq(payload);
    } else {
      if (measurementType == 'Dynamic')
        return this.createLiquidDynamicCoq(payload);
      else return this.createLiquidStaticCoq(payload);
    }
  }

  public getAllCoqs(): Observable<any> {
    return this.http.get<any>(`${API}/all_coqs`);
  }

  private createLiquidStaticCoq(payload) {
    return this.http.post<any>(`${API}/create-liquid-static-coq`, payload);
  }
  private createLiquidDynamicCoq(payload) {
    return this.http.post<any>(`${API}/create-liquid-dynamic-coq`, payload);
  }

  private createGasStaticCoq(payload) {
    return this.http.post<any>(`${API}/create-gas-static-coq`, payload);
  }
  private createGasDynamicCoq(payload) {
    return this.http.post<any>(`${API}/create-gas-dynamic-coq`, payload);
  }
}
