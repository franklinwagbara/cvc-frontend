import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplyComponent } from '../apply/apply.component';
import { PreviewAppComponent } from '../apply/edit-preview/previewapp.component';
import { CompanyProfileComponent } from './company-profile/companyprofile.component';
import { CompanyInformationComponent } from './companyinformation.component';
import { CompanyAddressComponent } from './company-address/companyaddress.component';
import { CompanyDirectorComponent } from './companydirector.component.scss/companydirector.component';

const routes: Routes = [
  { path: '', component: CompanyProfileComponent },
  { path: 'companyprofile', component: CompanyProfileComponent },
  //{path: 'companyinformation', component: CompanyInformationComponent},
  { path: 'companyaddress', component: CompanyAddressComponent },
  { path: 'companydirector', component: CompanyDirectorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyInformationRoutingModule {}
