import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ApplicationComponent } from './application/application.component';
import { ApplicationViewTableComponent } from './application/view-application/application-view-table/application-view-table.component';
import { ViewApplicationComponent } from './application/view-application/view-application.component';
import { AllStaffComponent } from './settings/all-staff/all-staff.component';
import { AppStageDocsComponent } from './settings/app-stage-docs/app-stage-docs.component';
import { BranchSettingComponent } from './settings/branch-setting/branch-setting.component';
import { FieldZonalOfficeComponent } from './settings/field-zonal-office/field-zonal-office.component';
import { ModulesSettingComponent } from './settings/modules-setting/modules-setting.component';
import { StaffdeskComponent } from './staffdesk/staffdesk.component';
import { AppProcessComponent } from './settings/app-process/app-process.component';
import { MyDeskComponent } from './desk/my-desk/my-desk.component';
import { BarChartComponent } from './admin/dashboard/bar-chart/bar-chart.component';
import { ShowMoreComponent } from '../shared/reusable-components/show-more/show-more.component';
import { PhasedocumentsComponent } from './settings/phasedocuments/phasedocuments.component';
import { FilterleftComponent } from './admin/application-report/filterleft/filterleft.component';
import { PaymentFilterleftComponent } from './admin/payment-report/payment-filterleft/payment-filterleft.component';
import { FilterrightComponent } from './admin/application-report/filterright/filterright.component';
import { PaymentFilterrightComponent } from './admin/payment-report/payment-filterright/payment-filterright.component';
import { ExtrasComponent } from './admin/application-report/extras/extras.component';
import { PaymentExtrasComponent } from './admin/payment-report/payment-extras/payments-extras.component';
import { PaymentGraphModalComponent } from './admin/payment-report/payment-graph/payment-graph-modal.component';
import { GraphModalComponent } from './admin/application-report/graph-modal/graph-modal.component';
import { ApplicationReportComponent } from './admin/application-report/application-report.component';
import { PaymentReportComponent } from './admin/payment-report/payment-report.component';
import { ApplicationReportBarChartComponent } from './admin/application-report/bar-chart/bar-chart.component';
import { PaymentReportBarChartComponent } from './admin/payment-report/bar-chart/bar-chart.component';
import { LicenceComponent } from './licence/licence.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CoqApplicationFormComponent } from './coq-application-form/coq-application-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { NoaApplicationsByDepotComponent } from './noa-applications-by-depot/noa-applications-by-depot.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CoqApplicationsByDepotComponent } from './coq-applications-by-depot/coq-applications-by-depot.component';
import { FieldOfficerSettingComponent } from './settings/field-officer-setting/field-officer-setting.component';
import { AppFeeComponent } from './settings/app-fee/app-fee.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentViewTableComponent } from './payment/view-payment/payment-view-table/payment-view-table.component';
import { ViewPaymentComponent } from './payment/view-payment/view-payment.component';
import { RolesComponent } from './settings/roles/roles.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    StaffdeskComponent,
    ApplicationComponent,
    AllStaffComponent,
    ModulesSettingComponent,
    FieldZonalOfficeComponent,
    AppStageDocsComponent,
    PhasedocumentsComponent,
    BranchSettingComponent,
    ApplicationViewTableComponent,
    AppFeeComponent,
    AppProcessComponent,
    ViewApplicationComponent,
    MyDeskComponent,
    BarChartComponent,
    ShowMoreComponent,
    FilterleftComponent,
    GraphModalComponent,
    ExtrasComponent,
    FilterrightComponent,
    ApplicationReportComponent,
    PaymentReportComponent,
    PaymentFilterleftComponent,
    PaymentFilterrightComponent,
    PaymentGraphModalComponent,
    PaymentExtrasComponent,
    ApplicationReportBarChartComponent,
    PaymentReportBarChartComponent,
    LicenceComponent,
    ScheduleComponent,
    AppFeeComponent,
    PaymentComponent,
    ViewPaymentComponent,
    PaymentViewTableComponent,
    RolesComponent,

    CoqApplicationFormComponent,
    NoaApplicationsByDepotComponent,
    CoqApplicationsByDepotComponent,
    FieldOfficerSettingComponent,
  ],

  imports: [
    CommonModule,
    AdminRoutingModule,
    // NgbModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatGridListModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
  ],
  exports: [],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class AdminModule {}
