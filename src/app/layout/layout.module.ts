import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InspectorLayoutComponent } from './sidebar/inspector-layout/inspector-layout.component';
import { SuperadminLayoutComponent } from './sidebar/superadmin-layout/superadmin-layout.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { CompanyLayoutComponent } from './company-layout/company-layout.component';
import { CompanyTopNavComponent } from './company-layout/company-top-nav/company-top-nav.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    InspectorLayoutComponent,
    SuperadminLayoutComponent,
    NavItemComponent,
    TopNavComponent,
    CompanyLayoutComponent,
    CompanyTopNavComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    // NgbModule,
    SharedModule,
    MatIconModule,
  ],
  exports: [
    AdminLayoutComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    InspectorLayoutComponent,
    SuperadminLayoutComponent,
    CompanyLayoutComponent,
  ],
})
export class LayoutModule {}
