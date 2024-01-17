import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewCoqTankComponent } from '../view-coq-tank/view-coq-tank.component';

@Component({
  selector: 'app-coq-application-view-table',
  templateUrl: './coq-application-view-table.component.html',
  styleUrls: ['./coq-application-view-table.component.scss'],
})
export class CoqApplicationViewTableComponent implements OnInit {
  @Input() application: any;
  @Input() tankList: any;
  @Input() appId: number;
  @Input() appSource: string;
  @Input() isCoqProcessor: boolean;

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
      productType: this.application.ProductType,
      form: ViewCoqTankComponent,
    };

    this.dialog.open(operationConfiguration.form, {
      data: {
        tanks: operationConfiguration.tanks,
        productType: operationConfiguration.productType
      },
    });
  }
}
