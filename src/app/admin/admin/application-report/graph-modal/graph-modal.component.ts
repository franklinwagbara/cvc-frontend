import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ExtrasComponent } from '../extras/extras.component';

@Component({
  selector: 'app-graph-modal',
  templateUrl: './graph-modal.component.html',
  styleUrls: ['./graph-modal.component.css'],
})
export class GraphModalComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit(true);
  }
}
