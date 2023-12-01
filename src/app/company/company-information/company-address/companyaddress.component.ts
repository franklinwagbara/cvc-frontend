import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { companyProfile } from 'src/app/shared/models/apply.model';
import { LoginModel } from 'src/app/shared/models/login-model';
import { AuthenticationService } from 'src/app/shared/services';
import { CompanyService } from 'src/app/shared/services/company.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  templateUrl: 'companyaddress.component.html',
  styleUrls: ['./companyaddress.component.scss'],
})
export class CompanyAddressComponent implements OnInit {
  addressForm: FormGroup;
  address: companyProfile = new companyProfile();
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
    private cdr: ChangeDetectorRef
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
    this.addressForm = new FormGroup(
      {
        type: new FormControl(''),
        address_1: new FormControl('', [Validators.required]),
        address_2: new FormControl(''),
        city: new FormControl('', [Validators.required]),
        stateName: new FormControl('', [Validators.required]),
        postal_code: new FormControl('', [Validators.required]),
        countryName: new FormControl('', [Validators.required]),
      },
      {}
    );
  }

  getCompanyProfile(email) {
    this.companyService.getCompanyProfile(email).subscribe({
      next: (res) => {
        this.address = res.data.registeredAddress;
        this.countries = res.data.nations;
        this.addressForm.get('countryName').setValue(this.address.countryName);
        console.log(res);
        this.cd.markForCheck();
      },
    });
  }

  getId(id) {
    this.states = this.allStates.filter((a) => a.countryID == id.value);
    this.address.countryName = id.text;
  }

  getStates() {
    this.companyService.getStates().subscribe({
      next: (res) => {
        this.allStates = res.data;
        this.addressForm.get('stateName').setValue(this.address.stateName);
        // this.addressForm.get('countryName').valueChanges.subscribe({
        //   next: (value) => {
        //     this.states = res.data.filter((a) => a.countryID == value);
        //     console.log(this.states);
        //   },
        // });
        this.cd.markForCheck();
      },
    });
  }

  save() {
    //this.isSubmitted = true;
    //if (this.addressForm.invalid) return;
    const userData = this.addressForm.value;
    userData.countryName = this.address.countryName;
    console.log(userData);
    this.companyService.saveCompanyProfile(userData).subscribe({
      next: (res) => {
        this.popupService.open('Record updated successfully', 'success');
      },
      error: (error: any) => {
        console.log(error);
        this.popupService.open(error?.error, 'error');
      },
    });
  }
}
