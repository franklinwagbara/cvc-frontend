import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SubRouteInfo } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
})
export class NavItemComponent implements OnInit, OnChanges {
  public isSidebarCollapsed = false;
  public active = false;
  public isSubMenuActive = false;
  public activeSubMenuItem = -1;
  public title = '';
  public subItems = null;
  public iconN = 'assets/svgs/apps.svg#$Outline';

  @Input('is-sidebar-collapsed') isSideBarCollapsedProp: boolean;
  @Input('title') titleProp: string;
  @Input('active') activeProp: boolean;
  @Input('sub-menu-active') subMenuActiveProp: boolean;
  @Input('sub-items') subItemsProp: SubRouteInfo[];
  @Input('icon-name_svg') iconName: string;
  @Input('icon-id_svg') iconId: string;
  @Input('icon-color') iconColor = 'black';

  @Output() onActive = new EventEmitter();

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'my-star-icon',
      sanitizer.bypassSecurityTrustResourceUrl('../../../assets/svgs/apps.svg')
    );
    this.iconN = `assets/svgs/apps.svg#Outline`;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.isSidebarCollapsed = this.isSideBarCollapsedProp;
    this.title = this.titleProp;
    this.active = this.activeProp || false;
    this.isSubMenuActive = this.subMenuActiveProp;
    this.subItems = this.subItemsProp;
  }

  ngOnInit(): void {
    this.isSidebarCollapsed = this.isSideBarCollapsedProp;
    this.title = this.titleProp;
    this.active = this.activeProp || false;
    this.isSubMenuActive = this.subMenuActiveProp;
    this.subItems = this.subItemsProp;
    this.iconN = `assets/svgs/${this.iconName}.svg#${this.iconId}`;
  }

  setActiveNavItem(navItem: string) {
    this.isSubMenuActive = !this.isSubMenuActive;
    this.activeSubMenuItem = -1;
    this.onActive.emit(this.title);
  }

  setActiveSubNavItem(id: number) {
    this.activeSubMenuItem = id;
  }
}
