import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-paymentextras',
  templateUrl: './payment-extras.component.html',
  styleUrls: ['./payment-extras.component.css'],
})
export class PaymentExtrasComponent implements OnInit {
  constructor() {}
  @Output() onPrint = new EventEmitter();
  @Output() onExport = new EventEmitter();
  @Output() onGenerateGraph = new EventEmitter();

  ngOnInit(): void {}

  printPage() {
    this.onPrint.emit(true);
  }

  exportPage() {
    this.onExport.emit(true);
  }

  generateGraph() {
    this.onGenerateGraph.emit(true);
  }
}
