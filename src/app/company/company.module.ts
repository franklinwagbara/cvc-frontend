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
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar } from '@angular/material/snack-bar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { CompanyRoutingModule } from './company-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messages.component';
import { MyScheduleComponent } from './schedules/myschedule.component';
import { MyapprovalsComponent } from './approvals/myapprovals.component';
import { ApplyComponent } from './apply/apply.component';
import { CvcApplicationsComponent } from './cvc-applications/cvc-applications.component';
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
import { ViewMessageComponent } from './messages/view-message/view-message.component';
import { ViewCoqCertsComponent } from './view-coq-certs/view-coq-certs.component';
import { ViewDebitNotesComponent } from './view-debit-notes/view-debit-notes.component';
import { ProcessingPlantComponent } from './settings/processing-plant/processing-plant.component';
import { TanksComponent } from './settings/processing-plant/tanks/tanks.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { StsApplicationComponent } from './apply/sts-application/sts-application.component';
import { StsApplicationsComponent } from './sts-applications/sts-applications.component';
import { RecipientsViewComponent } from './sts-applications/recipients-view/recipients-view.component';
import { DebitnotePaymentsumComponent } from './debitnote-paymentsum/debitnote-paymentsum.component';

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
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule
  ],
  declarations: [
    DashboardComponent,
    MessagesComponent,
    ChangePasswordComponent,
    MyScheduleComponent,
    MyapprovalsComponent,
    ApplyComponent,
    CvcApplicationsComponent,
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
    ViewMessageComponent,
    ViewCoqCertsComponent,
    ViewDebitNotesComponent,
    ProcessingPlantComponent,
    TanksComponent,
    StsApplicationComponent,
    StsApplicationsComponent,
    RecipientsViewComponent,
    DebitnotePaymentsumComponent,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class CompanyModule {}
