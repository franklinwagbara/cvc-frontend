import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { companyProfile } from '../../../../../src/app/shared/models/apply.model';
import { LoginModel } from '../../../../../src/app/shared/models/login-model';
import { AuthenticationService } from '../../../../../src/app/shared/services';
import { CompanyService } from '../../../../../src/app/shared/services/company.service';
import { PopupService } from '../../../../../src/app/shared/services/popup.service';

@Component({
  templateUrl: 'companydirector.component.html',
  styleUrls: ['./companydirector.component.scss'],
})
export class CompanyDirectorComponent implements OnInit {
  directorForm: FormGroup;
  companyDirector: companyProfile = new companyProfile();
  public currentUsername: LoginModel;
  private email = '';

  private cd: ChangeDetectorRef;
  countries: any;
  states: any;
  allStates: any;

  constructor(
    private companyService: CompanyService,
    private popupService: PopupService,
    private auth: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.cd = cdr;
    this.currentUsername = this.auth.currentUser;
    this.email = this.currentUsername.userId;
    this.createForm();
    this.cd.markForCheck();
  }

  ngOnInit() {
    this.getCompanyProfile(this.email);
    this.getStates();
    this.cd.markForCheck();
  }

  createForm() {
    this.directorForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      address_1: ['', [Validators.required]],
      address_2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      type: ['', [Validators.required]],
      countryName: ['', [Validators.required]],
      stateName: ['', [Validators.required]],
    })
  }

  getCompanyProfile(email) {
    this.companyService.getCompanyProfile(email).subscribe({
      next: (res) => {
        this.companyDirector = res.data.director;
        this.countries = res.data.nations;
        this.directorForm;
        // .get('countryName')
        // .setValue(this.companyDirector.countryName);
        console.log(res);
        this.cd.markForCheck();
      },
    });
  }

  getId(id) {
    this.states = this.allStates.filter((a) => a.countryID == id.value);
    this.companyDirector.countryName = id.text;
  }

  getStates() {
    this.companyService.getStates().subscribe({
      next: (res) => {
        this.allStates = res.data;
        this.directorForm;
        // .get('stateName')
        // .setValue(this.companyDirector.stateName);
        this.cd.markForCheck();
      },
    });
  }

  save() {
    //this.isSubmitted = true;
    //if (this.directorForm.invalid) return;
    const userData = this.directorForm.value;
    userData.countryName = this.companyDirector.countryName;
    console.log(userData);
    this.companyService.saveCompanyProfile(userData).subscribe({
      next: (res) => {
        this.popupService.open('Record updated successfully', 'success');
      },
      error: (error: any) => {
        console.log(error);
        this.popupService.open(error.error, 'error');
      },
    });
  }
}
