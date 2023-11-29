import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { uploadFile } from '../../shared/models/apply.model';
import { GenericService } from '../../shared/services';
import { ApplyService } from '../../shared/services/apply.service';
import { ModalService } from '../../shared/services/modal.service';
import { LibaryService } from 'src/app/shared/services/libary.service';

@Component({
  templateUrl: 'upload.component.html',
  styleUrls: ['./apply.component.scss'],
})
export class UploadComponent implements OnInit {
  uploadFile: File;
  categoryList: any;
  stateList: any;
  phaseList: any;
  phaseId: number;
  sizePerPage = 10;
  categoryId: string = '';
  uploadForm: FormGroup;
  state: string;
  lga: string;
  LgaId: number;
  stateId: number;
  title: 'Upload Application';
  uploadNewName: string;
  uploadNameDoc: string;
  genk: GenericService;
  data: any[];
  uploadBody: uploadFile = {} as uploadFile;
  uploadApplyForm: FormGroup;
  lgalist = [];
  statelist = [];
  category: string;
  address: string = '';
  phase: string;
  applicationTypeId: string = '';
  stagelist = [];
  phasestages: any;

  constructor(
    private cd: ChangeDetectorRef,
    private apply: ApplyService,
    private modalService: ModalService,
    private router: Router,
    private gen: GenericService,
    private libraryService: LibaryService
  ) {
    this.genk = gen;
  }

  ngOnInit() {
    this.initForm();
    this.getCategory();
    this.getStateList();
    this.data = [];
    this.sizePerPage = this.genk.sizeten;
  }

  initForm() {
    this.uploadApplyForm = new FormGroup({
      categoryId: new FormControl(this.categoryId, [Validators.required]),
      phaseId: new FormControl(this.phaseId, [Validators.required]),
      phaseStageId: new FormControl('', [Validators.required]),
      lgaId: new FormControl(this.LgaId),
      location: new FormControl(this.address, [Validators.required]),
      file: new FormControl('', [Validators.required]),
      doc: new FormControl('', [Validators.required]),
    });
  }

  get f() {
    return this.uploadApplyForm.controls;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadApplyForm.patchValue({
        file: file,
      });
    }
  }

  getCategory() {
    this.apply.getApplicationCategory().subscribe((res) => {
      this.categoryList = res.data.data;
      this.cd.markForCheck();
    });
    this.cd.markForCheck();
  }

  getPhases(e) {
    this.categoryId = e.target.value;
    this.apply.getApplicationPhases(e.target.value).subscribe((res) => {
      this.phaseList = res.data.data;
      this.cd.markForCheck();
    });

    this.apply.getpermitstages().subscribe((res) => {
      //debugger;
      this.stagelist = res.data.data;
      this.cd.markForCheck();
    });
  }

  getStateList() {
    this.libraryService.getStates().subscribe((res) => {
      this.stateList = res.data.data;
    });
    this.cd.markForCheck();
  }

  getLgaByState(e) {
    this.libraryService.getLGAByStateId(e.target.value).subscribe((res) => {
      this.lgalist = res.data.data;
    });
    this.cd.markForCheck();
  }

  changePhaseList(e) {
    this.phasestages = this.stagelist.filter((ps) => {
      return ps.phaseId == e.target.value;
    });
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

  submit() {
    const formDat: FormData = new FormData();
    formDat.append('categoryId', this.uploadApplyForm.get('categoryId').value);
    formDat.append('phaseId', this.uploadApplyForm.get('phaseId').value);
    formDat.append(
      'phaseStageId',
      this.uploadApplyForm.get('phaseStageId').value
    );
    formDat.append('LgaId', this.uploadApplyForm.get('lgaId').value);
    formDat.append('location', this.uploadApplyForm.get('location').value);
    formDat.append('doc', this.uploadApplyForm.get('file').value);
    // if (this.uploadFile) {
    //   formDat.append('doc', this.uploadFile, this.uploadNewName);
    // }

    console.log('formdata', formDat);

    this.apply.uploadApplyform(formDat).subscribe((res) => {
      if (res.statusCode == 300) {
        this.modalService.logNotice('Error', res.message, 'error');
      } else if (res.success) {
        if (res.data.responseCode == '00') {
          this.router.navigate(['/company/previewapp/' + res.data.data.appid]);
        }
      } else {
        //this.loadTable_Management(res.data);
        this.modalService.logNotice('Success', res.message, 'success');
      }
    });
  }

  // savecontinue(){
  //   // let s = this.genk.state;
  //   // let c = this.genk.category;
  //   // let p = this.genk.phase;
  //   // let a = this.genk.address;
  //   // let l = this.genk.lga;
  //   // let u = this.genk.upload;
  //   //debugger;
  //   this.apply.postsavecontinue(null, this.genk.state, this.genk.category, this.genk.phase, this.genk.address, this.genk.lga, this.genk.upload)
  //     .subscribe(res => {

  //       if(res.statusCode == 300){
  //         this.modalService.logNotice("Error", res.message, 'error');
  //       }
  //       else{
  //         this.modalService.logNotice("Success", res.message, 'success');
  //       }
  //   })
  // }
}
