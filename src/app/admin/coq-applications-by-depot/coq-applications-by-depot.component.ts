import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICOQ,
  ICoQApplication,
} from 'src/app/shared/interfaces/ICoQApplication';
import { CoqService } from 'src/app/shared/services/coq.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-coq-applications-by-depot',
  templateUrl: './coq-applications-by-depot.component.html',
  styleUrls: ['./coq-applications-by-depot.component.css'],
})
export class CoqApplicationsByDepotComponent implements OnInit {
  public coqs: ICoQApplication[];

  public tableTitles = {
    coqs: 'Certificate of Quality(s)',
  };

  public coqKeysMappedToHeaders = {
    importName: 'Importer',
    vesselName: 'Vessel Name',
    depotName: 'Receiving Terminal',
    dateOfVesselUllage: 'Date of Vessel Ullage',
    dateOfSTAfterDischarge: 'Date of Shore-Tank After Discharge',
    gov: 'GOV',
    gsv: 'GSV',
    createdBy: 'Created By',
  };

  constructor(
    private spinner: SpinnerService,
    private cdr: ChangeDetectorRef,
    private popUp: PopupService,
    private coqService: CoqService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  public fetchAllData() {
    this.spinner.open();

    this.coqService.getAllCOQs().subscribe({
      next: (res) => {
        this.coqs = res.data;

        this.spinner.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
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
        'noa-applications-by-depot',
        event.appId,
        'certificate-of-quantity',
        'new-application',
      ],
      { queryParams: { depotId: event.depotId, view: true, coqId: event.id } }
    );
  }
}
