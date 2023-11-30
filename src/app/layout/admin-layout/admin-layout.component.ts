import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent implements OnInit {
  public isCollapse = false;

  ngOnInit(): void {
  }

  onMenuOpen(open: boolean) {
    this.isCollapse = !open;
  }
}
