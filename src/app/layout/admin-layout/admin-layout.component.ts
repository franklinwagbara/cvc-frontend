import { Component, OnInit } from '@angular/core';
import { PageManagerService } from 'src/app/shared/services/page-manager.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent implements OnInit {
  public isCollapse = false;

  constructor(private pageManagerService: PageManagerService) {}

  ngOnInit(): void {
    this.pageManagerService.adminSidebarHover.subscribe({
      next: (value: boolean) => {
        this.isCollapse = !value;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  onMenuOpen(open: boolean) {
    this.isCollapse = !open;
  }
}
