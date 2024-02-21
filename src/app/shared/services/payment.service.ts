import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environment';
import { Observable } from 'rxjs';

const API = `${environment.apiUrl}/payment`

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  public getAllPayment() {
    return this.http.get<any>(`${API}/All-payment`);
  }

  public getPaymentById(id: any) {
    return this.http.get<any>(`${API}PaymentById?id=${id}`);
  }

  generateDebitNote(id: number) {
    return this.http.post<any>(`${API}/generate-debit-note`, null, { params: { id }});
  }

  getAllDebitNotes(id: number): Observable<any> {
    return this.http.get<any>(`${API}/get-debit-notes-by-appid`, { params: { id }});
  }

  getDebitNotePaymentSummary(id: number): Observable<any> {
    return this.http.get<any>(`${API}/get-pending-payments-by-id`, { params: { id }});
  }

  createDebitNoteRRR(id: number): Observable<any> {
    return this.http.get<any>(`${API}/create-debit-note-rrr`, {params: { id }});
  }

  confirmDebitNotePayment(id: number, orderId: number): Observable<any> {
    return this.http.get<any>(`${API}/confirm-payment`, { params: { id, orderId }});
  }
}
