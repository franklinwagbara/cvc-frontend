import { Component, OnInit } from '@angular/core';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-phasedocuments',
  templateUrl: './phasedocuments.component.html',
  styleUrls: ['./phasedocuments.component.css'],
})
export class PhasedocumentsComponent implements OnInit {
  form: FormGroup = new FormGroup({
    ApplicationTypeId: new FormControl(''),
    CategoryId: new FormControl(''),
    PhaseId: new FormControl(''),
    CompDocIds: new FormControl(''),
    FacDocIds: new FormControl(''),
  });
  closeResult: string;
  compDocs: any;
  facDocs: any;

  constructor(
    private formBuilder: FormBuilder
  ) // private modalService: NgbModal
  {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      ApplicationTypeId: ['', Validators.required],
      CategoryId: ['', Validators.required],
      PhaseId: ['', Validators.required],
      CompDocIds: ['', Validators.required],
      FacDocIds: ['', Validators.required],
    });
  }

  open(content) {
    // this.modalService
    //   .open(content, { ariaLabelledBy: 'modal-basic-title' })
    //   .result.then(
    //     (result) => {
    //       this.closeResult = `Closed with: ${result}`;
    //     },
    //     (reason) => {
    //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //     }
    //   );
  }

  private getDismissReason(reason: any): any {
    // if (reason === ModalDismissReasons.ESC) {
    //   return 'by pressing ESC';
    // } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //   return 'by clicking on a backdrop';
    // } else {
    //   return `with: ${reason}`;
    // }
  }

  onSubmit() {}
}
