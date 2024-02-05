import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-capsule-card',
  templateUrl: './capsule-card.component.html',
  styleUrls: ['./capsule-card.component.scss'],
})
export class CapsuleCardComponent implements OnInit {
  @Input() data: { [key: string]: any };
  @Input() colMappings: { [key: string]: any };
  public headers: string[];
  public values: any[];

  ngOnInit(): void {
    this.headers = Object.keys(this.data);
    this.values = Object.values(this.data);
  }
}
