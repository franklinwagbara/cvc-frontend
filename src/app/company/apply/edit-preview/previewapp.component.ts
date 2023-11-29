import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PreviewModel, uploadFile } from '../../../shared/models/apply.model';
import {
  AuthenticationService,
  GenericService,
} from '../../../shared/services';
import { ApplyService } from '../../../shared/services/apply.service';
import { ModalService } from '../../../shared/services/modal.service';
import { LibaryService } from 'src/app/shared/services/libary.service';

@Component({
  templateUrl: 'previewapp.component.html',
  styleUrls: ['./previewapp.component.scss'],
})
export class PreviewAppComponent {
  uploadFile: File;
  categoryList: any;
  stateList: any;
  lgaList: any;
  phaseList: any;
  phaseId: number;
  phaseStageId: number;
  sizePerPage = 10;
  categoryId: string = '';
  uploadForm: FormGroup;
  state: string;
  lga: string;
  LgaId: number;
  stateId: number;
  title: 'Preview App';
  uploadNewName: string;
  appid: number;
  uploadNameDoc: string;
  genk: GenericService;
  data: any[];
  uploadBody: uploadFile = {} as uploadFile;
  previewForm: FormGroup;
  lgalist = [];
  statelist = [];
  category: string;
  address: string = '';
  phase: string;
  applicationTypeId: string = '';
  companyDetail: any;
  previewBody: PreviewModel = {} as PreviewModel;
  canSubmit = true;
  stagelist = [];
  phasestages: any;
  column: any;

  constructor(
    private cd: ChangeDetectorRef,
    private apply: ApplyService,
    private router: Router,
    private auth: AuthenticationService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private gen: GenericService,
    private libraryService: LibaryService,
    private fb: FormBuilder
  ) {
    this.genk = gen;
  }

  ngOnInit() {
    this.getCompanyDetailById();

    this.auth.getPhaseCategories().subscribe((res) => {
      this.phaseList = res.data.data.allPermits;
    });

    this.getStateList();
    this.initForm();
    this.getCategory();
    this.data = [];
    this.cd.markForCheck();
  }

  initForm() {
    this.previewForm = new FormGroup({
      categoryId: new FormControl(this.categoryId, [Validators.required]),
      phaseId: new FormControl(this.phaseId, [Validators.required]),
      phaseStageId: new FormControl(this.phaseId, [Validators.required]),
      lgaId: new FormControl(this.LgaId),
      stateId: new FormControl(this.stateId),
      location: new FormControl(this.address, [Validators.required]),
      file: new FormControl('', [Validators.required]),
      doc: new FormControl('', [Validators.required]),
    });
    this.cd.markForCheck();
  }

  get f() {
    return this.previewForm.controls;
  }

  get columns() {
    if (this.previewBody.categoryCode?.toUpperCase() == 'WLN') {
      this.column = this.noticeColumn;
    }

    if (
      this.previewBody.categoryCode?.toUpperCase() ==
      'WELL REENTRY SUSPENSION PERMIT PLUG AND ABANDOMENT PERMIT'
    ) {
      this.column = this.entryAColumn;
    }

    if (
      this.previewBody.categoryCode?.toUpperCase() ==
      'WELL REENTRY APPLICATION FORM '
    ) {
      this.column = this.entryBColumn;
    }

    return this.column;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.previewForm.patchValue({
        file: file,
      });
    }
  }

  getCategory() {
    this.apply.getApplicationCategory().subscribe((res) => {
      this.categoryList = res.data.data;
    });
    this.cd.markForCheck();
  }

  getPhases(e) {
    this.categoryId = e.target.value;
    this.apply.getApplicationPhases(e.target.value).subscribe((res) => {
      //debugger;
      this.phaseList = res.data.data;
    });

    // this.apply.getpermitstages().subscribe(res => {
    //   //debugger;
    //   this.stagelist = res.data.data;

    // });

    this.cd.markForCheck();
  }

  getStateList() {
    this.libraryService.getStates().subscribe((res) => {
      this.stateList = res.data.data;
    });
    this.cd.markForCheck();
  }

  // getLGAList() {
  //   this.apply.getLgaList().subscribe(res =>{
  //     this.lgalist= res.data.data;
  //   });
  //   this.cd.markForCheck();
  // }
  //   let obj = this.statelist.filter(x => x.state == this.state)[0];
  //    this.lgalist = obj.lga
  //  }

  getLgaByState(e) {
    this.libraryService.getLGAByStateId(e.target.value).subscribe((res) => {
      this.lgaList = res.data.data;
    });
    this.cd.markForCheck();
  }

  getCompanyDetailById() {
    this.route.params.subscribe((params) => {
      this.appid = params['id'];
    });
    this.apply.getappdetailsbyId(this.appid).subscribe((res) => {
      this.previewBody = res.data.data as PreviewModel;

      this.libraryService
        .getLGAByStateId(this.previewBody.stateId)
        .subscribe((res) => {
          this.lgaList = res.data.data;
          this.cd.markForCheck();
        });

      this.apply.getpermitstages().subscribe((res) => {
        this.phasestages = res.data.data.filter((ps) => {
          return ps.phaseId == this.previewBody.phaseStageId;
        });
        this.phaseId = this.phasestages[0].phaseId;

        this.cd.markForCheck();
      });
      this.apply
        .getApplicationPhases(this.phasestages[0].phaseId)
        .subscribe((res) => {
          this.phaseList = res.data.data;
          debugger;
          this.columns();
          this.cd.markForCheck();
        });
    });

    this.cd.markForCheck();
  }

  toggleActive() {
    this.canSubmit = false;
    this.cd.markForCheck();
  }

  saveTemplate(DeFile: any) {
    this.uploadFile = <File>DeFile.target.files[0];
    if (!this.uploadFile) {
      return;
    }
    if (this.uploadFile.size < 1 || this.uploadFile.size > 1024 * 1024 * 50) {
      this.uploadForm.controls['uploadFile'].setErrors({ incorrect: true });
      this.uploadFile = null;
      return;
    } else {
      this.uploadForm.controls['uploadFile'].setErrors(null);
    }
    this.uploadNewName = this.gen.getExpDoc(
      this.uploadFile.name,
      this.uploadFile.type
    );
    this.uploadNameDoc = this.uploadNewName;
    // let dockind = this.gen.getExt(this.File.name);
  }

  changePhaseList(e) {
    this.phasestages = this.stagelist.filter((ps) => {
      return ps.phaseId == e.target.value;
    });
    this.cd.markForCheck();
  }

  submit() {
    // let addr = this.f['address'].value;
    let a = this.categoryId;
    let b = this.phaseId;

    const formDat: FormData = new FormData();
    formDat.append('categoryId', this.previewForm.get('categoryId').value);
    formDat.append('phaseId', this.previewForm.get('phaseId').value);
    formDat.append('LgaId', this.previewForm.get('lgaId').value);
    formDat.append('location', this.previewForm.get('location').value);
    formDat.append('doc', this.previewForm.get('file').value);
    // if (this.uploadFile) {
    //   formDat.append('doc', this.uploadFile, this.uploadNewName);
    // }
    this.apply.uploadApplyform(formDat).subscribe((res) => {
      if (res.statusCode == 300) {
        this.modalService.logNotice('Error', res.message, 'error');
      } else {
        //this.loadTable_Management(res.data);
        this.modalService.logNotice('Success', res.message, 'success');
      }
    });
  }

  displayPayment() {
    this.router.navigate(['/company/paymentsum/' + this.appid]);
  }

  noticeColumn = [
    {
      columnDef: 'field',
      header: 'FIELD',
    },

    {
      columnDef: 'block',
      header: 'BLOCK',
    },
    {
      columnDef: 'terrain',
      header: 'TERRAIN',
    },
    {
      columnDef: 'wellLocationCategory',
      header: 'WELL LOCATION CATEGORY',
    },
    {
      columnDef: 'spudDate',
      header: 'SPUD DATE',
    },
    {
      columnDef: 'wellSpudName',
      header: 'WELL SPUD NAME',
    },
    {
      columnDef: 'wellClassApplied',
      header: 'WELL CLASS APPLIED',
    },
    {
      columnDef: 'wellSurfaceCoordinates',
      header: 'WELL SURFACE COORDINATES ',
    },
    {
      columnDef: 'proposedRig',
      header: 'PROPOSED RIG',
    },
    {
      columnDef: 'expectedVoloume',
      header: 'EXPECTED VOLUMES ',
    },
    {
      columnDef: 'targetReserves',
      header: 'TARGET RESERVES',
    },
    {
      columnDef: 'afe',
      header: 'AFE',
    },
  ];

  entryAColumn = [
    {
      columnDef: 'wellLocationCategory',
      header: 'WELL LOCATION CATEGORY',
    },
    {
      columnDef: 'wellName',
      header: 'WELL NAME',
    },
    {
      columnDef: 'natureOfOperation',
      header: 'NATURE OF OPERATION',
    },
    {
      columnDef: 'plugbackInterval',
      header: 'PLUGBACK INTERVAL',
    },
    {
      columnDef: 'rigForOperation',
      header: 'RIG FOR OPERATION',
    },
    {
      columnDef: 'lastProductionRate',
      header: 'LAST PRODUCTION RATE',
    },
    {
      columnDef: 'initialReservesAllocationOfWell',
      header: 'INTITIAL RESERVES ALLOCATION OF WELL',
    },
    {
      columnDef: 'cumulativeProductionForWell',
      header: 'CUMULATIVE PRODUCTION OF WELL',
    },
    {
      columnDef: 'afe',
      header: 'AFE',
    },
    {
      columnDef: 'estimatedOperationDays',
      header: 'ESTIMATED OPERATION DAYS',
    },
  ];

  entryBColumn = [
    {
      columnDef: 'wellLocationCategory',
      header: 'WELL LOCATION CATEGORY',
    },
    {
      columnDef: 'wellName',
      header: 'WELL NAME',
    },
    {
      columnDef: 'natureOfOperation',
      header: 'NATURE OF OPERATION',
    },
    {
      columnDef: 'wellCompletionInterval',
      header: 'WELL COMPLETETION INTERVAL',
    },
    {
      columnDef: 'rigForOperation',
      header: 'RIG FOR OPERATION',
    },
    {
      columnDef: 'preOperationProductionRate',
      header: 'PRE OPERATION PRODUCTION RATE',
    },
    {
      columnDef: 'postOperationProductionRate',
      header: 'POST OPERATION PRODUCTION RATE',
    },

    {
      columnDef: 'initialReservesAllocationOfWell',
      header: 'INTITIAL RESERVES ALLOCATION OF WELL',
    },
    {
      columnDef: 'cumulativeProductionForWell',
      header: 'CUMULATIVE PRODUCTION OF WELL',
    },

    {
      columnDef: 'targetReserves',
      header: 'TARGET RESERVES',
    },
    {
      columnDef: 'afe',
      header: 'AFE',
    },
    {
      columnDef: 'estimatedOperationDays',
      header: 'ESTIMATED OPERATION DAYS',
    },
  ];
}
