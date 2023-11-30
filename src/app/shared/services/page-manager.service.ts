import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageManagerService {
  public adminSidebarMenuOpen = true;
  public adminSidebarHover: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }
}
