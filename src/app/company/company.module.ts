import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { CompanyRoutingModule } from './company-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messages.component';
import { MyScheduleComponent } from './schedules/myschedule.component';
import { MypermitsComponent } from './permits/mypermits.component';
import { ApplyComponent } from './apply/apply.component';
import { MyApplicationComponent } from './my-applications/myapplication.component';
import { RegisterDirectorComponent } from './director/registerdirector.component';
import { CompanyComponent } from './company.component';
import { UploadComponent } from './apply/upload.component';
import { PreviewAppComponent } from './apply/edit-preview/previewapp.component';
import { PaymentSumComponent } from './payment-summary/paymentsum.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { AdditionalDocListFormComponent } from './document-upload/additional-doc-list-form/additional-doc-list-form.component';
import { NewApplicationComponent } from './apply/new-application/new-application.component';
import { RenewApplicationComponent } from './apply/renew-application/renew-application.component';
import { ViewApplicationComponent } from './view-application/view-application.component';
import { ApplicationViewTableComponent } from './view-application/application-view-table/application-view-table.component';
import { ViewCoqCertsComponent } from './view-coq-certs/view-coq-certs.component';
import { ViewDebitNotesComponent } from './view-debit-notes/view-debit-notes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CompanyRoutingModule,
    LayoutModule,
    SharedModule,
    MatButtonModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatStepperModule,
    MatExpansionModule,
    MatCardModule,
  ],
  declarations: [
    DashboardComponent,
    MessagesComponent,
    ChangePasswordComponent,
    MyScheduleComponent,
    MypermitsComponent,
    ApplyComponent,
    MyApplicationComponent,
    RegisterDirectorComponent,
    CompanyComponent,
    UploadComponent,
    ApplyComponent,
    PreviewAppComponent,
    PaymentSumComponent,
    DocumentUploadComponent,
    AdditionalDocListFormComponent,
    NewApplicationComponent,
    RenewApplicationComponent,
    ViewApplicationComponent,
    ApplicationViewTableComponent,
    ViewCoqCertsComponent,
    ViewDebitNotesComponent,
  ],
  providers: [],
})
export class CompanyModule {}
