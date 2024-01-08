import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Util } from '../../../../src/app/shared/lib/Util';
import { CoqAppFormService } from '../../../../src/app/shared/services/coq-app-form.service';
import { CoqService } from '../../../../src/app/shared/services/coq.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';

@Component({
  selector: 'app-view-coq-application',
  templateUrl: './view-coq-application.component.html',
  styleUrls: ['./view-coq-application.component.css']
})
export class ViewCoqApplicationComponent implements OnInit {
  application: any;
  @Input() isGasProduct: boolean;
  dataSources: MatTableDataSource<any>[];
  coqId: number;

  displayedColumns: string[]

  objNotEmpty = Util.objNotEmpty

  isIMG = Util.isIMG;
  isPDF = Util.isPDF;

  constructor(
    public coqFormService: CoqAppFormService,
    private coqService: CoqService,
    private route: ActivatedRoute,
    private spinner: SpinnerService,
    private popUp: PopupService
  ) {
    this.route.params.subscribe((ob) => {
      this.coqId = parseInt(ob['id']);
    })
  }

  ngOnInit(): void {
    this.spinner.show('Fetching CoQ Data...')
    this.coqService.getCOQById(this.coqId).subscribe({
      next: (res: any) => {
        this.application = res?.data;
        this.spinner.close();
      },
      error: (error: unknown) => {
        console.log(error);
        this.popUp.open('Something went wrong while retreiving data', 'error');
        this.spinner.close();
      }
    })
  }

}
