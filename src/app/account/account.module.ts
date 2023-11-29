import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';

import { AccountRoutingModule } from './accoun-routing.module';
import { AccountComponent } from './account.component';
import { LoginRedirectComponent } from './login-redirect.component';


@NgModule({
  declarations: [
    AccountComponent,
    LoginRedirectComponent
  
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AccountComponent],
})
export class AccountModule {}
