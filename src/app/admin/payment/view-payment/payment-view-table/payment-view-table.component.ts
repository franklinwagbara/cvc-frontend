import { Component, OnInit, Input } from '@angular/core';
import { Application } from 'src/app/company/my-applications/myapplication.component';

@Component({
  selector: 'app-payment-view-table',
  templateUrl: './payment-view-table.component.html',
  styleUrls: ['./payment-view-table.component.scss'],
})
export class PaymentViewTableComponent implements OnInit {
  @Input() payment: any;

  constructor() {}

  ngOnInit(): void {
    //console.log(this.payment);
  }
}
