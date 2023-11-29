import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CompanyProfileComponent } from './company-profile/companyprofile.component';
import { CompanyInformationComponent } from './companyinformation.component';
import { CompanyAddressComponent } from './company-address/companyaddress.component';
import { CompanyDirectorComponent } from './companydirector.component.scss/companydirector.component';
import { CompanyInformationRoutingModule } from './company-information.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CompanyInformationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CompanyInformationComponent,
    CompanyProfileComponent,
    CompanyAddressComponent,
    CompanyDirectorComponent,
  ],
  providers: [],
})
export class CompanyInformationModule {}
