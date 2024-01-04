import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  public getAllPayment() {
    return this.http.get<any>(`${environment.apiUrl}/Payment/All-payment`);
  }

  public getPaymentById(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/Payment/PaymentById?id=${id}`
    );
  }
}
