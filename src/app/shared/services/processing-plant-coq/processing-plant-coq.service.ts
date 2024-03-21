import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductType } from '../../constants/productType';

const API = `${environment.apiUrl}/ProcessingPlantCOQ`;

@Injectable({
  providedIn: 'root',
})
export class ProcessingPlantCOQService {
  constructor(private http: HttpClient) {}

  public createCoQ(payload: any, productType: ProductType) {
    if (productType == ProductType.GAS) {
      return this.createGasCoq(payload);
    } else if (productType == ProductType.LIQUID) {
      return this.createLiquidCoq(payload);
    } else {
      return this.createCondensateCoq(payload);
    }
  }

  public getAllCoqs(): Observable<any> {
    return this.http.get<any>(`${API}/all_coqs`);
  }

  private createLiquidCoq(payload) {
    return this.http.post<any>(`${API}/create-liquid-coq`, payload);
  }

  private createGasCoq(payload) {
    return this.http.post<any>(`${API}/create-gas-static-coq`, payload);
  }
  private createCondensateCoq(payload) {
    return this.http.post<any>(`${API}/create-condensate-coq`, payload);
  }
}
