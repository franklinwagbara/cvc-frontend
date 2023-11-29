import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent implements OnInit {
  public isCollapse: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onMenuOpen(open: Event) {
    this.isCollapse = !this.isCollapse;
  }
}
