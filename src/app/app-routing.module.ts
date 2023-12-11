import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AuthGuard } from './shared/guards/auth-guard.service';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { CompanyGuard } from './shared/guards/company.guard';
import { AdminGuard } from './shared/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'company',
    component: CompanyComponent,
    loadChildren: () =>
      import('./company/company.module').then((m) => m.CompanyModule),
    canActivate: [CompanyGuard],
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
