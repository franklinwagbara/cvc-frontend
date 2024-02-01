import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Util } from './shared/lib/Util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CVC & CoQ Portal';

  constructor(private router: Router) {
    this.router.events.subscribe((obs) => {
      if (obs instanceof NavigationEnd) {
        Util.scrollToTop();
      }
    })
  }
}
