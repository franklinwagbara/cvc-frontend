import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../src/app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staffdesk',
  templateUrl: './staffdesk.component.html',
  styleUrls: ['./staffdesk.component.css'],
})
export class StaffdeskComponent implements OnInit {
  apps = [];

  constructor(private router: Router, private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.auth.getStaffDesk().subscribe((res) => {
      if (res.success) {
        this.apps = res.data.data;
      }
    });
  }
}
