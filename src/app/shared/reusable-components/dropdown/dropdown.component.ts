import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { IMenuItem, ISubmenu } from '../../interfaces/menuItem';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit, AfterViewInit {
  public isOpen$ = new BehaviorSubject<boolean>(false);
  public isOpen = false;
  public isActive = false;

  @Input() title: string;
  @Input() path: string;
  @Input('menu-items') menuItems: IMenuItem[];

  @ViewChild('menu_item') menuItem;
  @ViewChild('dropdown') dropdown;

  constructor(
    private elRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      console.log(
        'active: ',
        this.isPathActive(),
        this.router.url,
        this.menuItems
      );
    });
  }

  ngAfterViewInit(): void {
    console.log(
      'active after: ',
      this.isPathActive(),
      this.router.url,
      this.menuItems
    );
  }

  @HostListener('document:click', ['$event'])
  onClickOutSide(event) {
    if (
      !this.menuItem.nativeElement.contains(event.target) &&
      !this.dropdown.nativeElement.contains(event.target)
    ) {
      this.isOpen = false;
      this.isOpen$.next(false);
    }
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
    this.isOpen$.next(this.isOpen);
  }

  navigateTo(menuItem: ISubmenu) {
    if (!menuItem.url) return;
    this.router.navigate([menuItem.url]);
  }

  navigateToUrl(url: string) {
    if (!this.menuItems || (this.menuItems.length === 0 && url))
      this.router.navigate([url]);
  }

  public isPathActive() {
    if (
      this.path &&
      this.path.length > 0 &&
      this.router.url.includes(this.path)
    ) {
      this.isActive = true;
      return true;
    }

    if (this.menuItems && this.menuItems.length > 0)
      for (const m of this.menuItems) {
        console.log('for: ', this.router.url, m.url);
        if (this.router.url.includes(m.url)) {
          this.isActive = true;
          return true;
        }
      }

    this.isActive = false;
    return false;
  }
}
