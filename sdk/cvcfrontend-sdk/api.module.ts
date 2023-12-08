import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AccountService } from './api/account.service';
import { AppStageDocumentsService } from './api/appStageDocuments.service';
import { ApplicationService } from './api/application.service';
import { ApplicationProcessesService } from './api/applicationProcesses.service';
import { AuthService } from './api/auth.service';
import { CompanyService } from './api/company.service';
import { GeneralReportService } from './api/generalReport.service';
import { InspectionService } from './api/inspection.service';
import { LibraryService } from './api/library.service';
import { LicensesService } from './api/licenses.service';
import { LocationService } from './api/location.service';
import { MessageService } from './api/message.service';
import { PaymentService } from './api/payment.service';
import { SchedulesService } from './api/schedules.service';
import { StaffService } from './api/staff.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
