import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewCoqTankComponent } from '../../coq-application-view/view-coq-tank/view-coq-tank.component';

@Component({
  selector: 'app-ppcoq-application-view-table',
  templateUrl: './ppcoq-application-view-table.component.html',
  styleUrls: ['./ppcoq-application-view-table.component.css'],
})
export class PpcoqApplicationViewTableComponent {
  @Input() application: any;
  @Input() tankList: any;
  @Input() appId: number;
  @Input() appSource: string;
  @Input() isCoqProcessor: boolean;
  @Input() isProcessingPlant: boolean;

  public depotId?: number;
  public coqId?: number;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.depotId = +param['depotId'];
      this.coqId = +param['coqId'];
    });
  }

  viewApplicationInFull() {
    this.router.navigate([`/admin/view-application-in-full/${this.appId}`], {
      queryParams: { id: this.appId, appSource: this.appSource },
    });
  }

  viewTanks() {
    const operationConfiguration = {
      tanks: this.tankList,
      productType: this.application.productType,
      form: ViewCoqTankComponent,
    };

    this.dialog.open(operationConfiguration.form, {
      data: {
        tanks: operationConfiguration.tanks,
        productType: operationConfiguration.productType,
      },
    });
  }
}
