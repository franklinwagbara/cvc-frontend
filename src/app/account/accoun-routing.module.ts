import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { LoginRedirectComponent } from './login-redirect.component';

const routes: Routes = [
    {path: '', component: AccountComponent},
    {path: 'account', component: AccountComponent},
    {path: 'loginredirect', component: LoginRedirectComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
