import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
        this.scrollToTop();
      }
    })
  }

  scrollToTop(): void {
    if (document.documentElement) {
      document.documentElement.scroll({behavior: 'smooth', top: 0});
    } else {
      document.body.scroll({behavior: 'smooth', top: 0})
    }
  }
}
