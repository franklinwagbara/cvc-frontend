import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.css'],
})
export class PageTitleComponent {
  @Input() isGasProduct = true;
  @Input() ProductName: string;
}
