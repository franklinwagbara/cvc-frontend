import { Component, OnInit, EventEmitter, Output } from '@angular/core';
// import { PaymentExtrasComponent } from '../extras/extras.component';

@Component({
  selector: 'app-paymentgraph-modal',
  templateUrl: './payment-graph-modal.component.html',
  styleUrls: ['./payment-graph-modal.component.css'],
})
export class PaymentGraphModalComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit(true);
  }
}
