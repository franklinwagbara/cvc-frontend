import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ICOQ,
  ICoQApplication,
} from '../../shared/interfaces/ICoQApplication';
import { CoqService } from '../../shared/services/coq.service';
import { PopupService } from '../../shared/services/popup.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { CoqAppFormService } from '../../shared/services/coq-app-form.service';
import { AuthenticationService } from 'src/app/shared/services';
import { ProcessingPlantCOQService } from 'src/app/shared/services/processing-plant-coq/processing-plant-coq.service';

// Only Field Officers Have Access
@Component({
  selector: 'app-coq-applications-by-depot',
  templateUrl: './coq-applications-by-depot.component.html',
  styleUrls: ['./coq-applications-by-depot.component.css'],
})
export class CoqApplicationsByDepotComponent implements OnInit {
  public coqs: ICoQApplication[];
  pageTitle: string;

  coqKeysMappedToHeaders: any;

  constructor(
    private spinner: SpinnerService,
    private cdr: ChangeDetectorRef,
    private popUp: PopupService,
    private coqService: CoqService,
    public coqFormService: CoqAppFormService,
    private router: Router,
    private auth: AuthenticationService,
    private ppCoqService: ProcessingPlantCOQService,
  ) {
    this.coqKeysMappedToHeaders = auth.isHppitiStaff
      ?  {
          plantPrice: 'Plant Price',
          gov: 'GOV',
          gsv: 'GSV'
        }
      : {
          importName: 'Importer Name',
          vesselName: 'Vessel Name',
          depotName: 'Receiving Terminal',
          dateOfVesselUllage: 'Date of Vessel Ullage',
          dateOfSTAfterDischarge: 'Date of Shore-Tank After Discharge',
          gov: 'GOV',
          gsv: 'GSV',
          depotPrice: 'Depot Price (NGN)'
        }
  }

  ngOnInit(): void {
    this.fetchAllData();
  }

  public fetchAllData() {
    this.spinner.open();

    (this.auth.isHppitiStaff 
      ? this.ppCoqService.getAllCoqs() 
      : this.coqService.getAllCOQs()
    ).subscribe({
      next: (res) => {
        this.coqs = (res?.data || []).reverse();
        this.spinner.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
        this.popUp.open('Something went wrong while retrieving data.', 'error');

        this.spinner.close();
        this.cdr.markForCheck();
      },
    });
  }

  public onViewCOQ(event: ICOQ) {
    this.router.navigate(
      [
        'admin',
        'coq',
        'coq-applications-by-depot',
        event.id,
      ]
    );
  }
}
