import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDipMethod } from 'src/app/admin/processing-plant/coq-application-form/coq-application-pp-form.component';
import { environment } from 'src/environments/environment';

const API = `${environment.apiUrl}/DippingMethod`;

@Injectable({
  providedIn: 'root',
})
export class DipMethodService {
  constructor(private http: HttpClient) {}

  public getAll() {
    return this.http.get<any>(`${API}/get-all-dippingMethod`);
  }

  public postDippingMethod(model: IDipMethod) {
    return this.http.post<any>(`${API}/add-dippingMethods`, model);
  }

  public deleteDippingMethod(id: any) {
    return this.http.delete<any>(`${API}/delete-dippingMethods`, {
      params: { id },
    });
  }

  public updateDippingMethod(model: IDipMethod) {
    return this.http.put<any>(`${API}/edit-dippingMethod`, model, {
      params: { id: model.id },
    });
  }
}
