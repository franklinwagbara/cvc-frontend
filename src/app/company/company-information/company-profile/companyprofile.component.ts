import { Component, OnInit , ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { LoginModel } from 'src/app/shared/models/login-model';
import { AuthenticationService } from 'src/app/shared/services';
import { CompanyService } from 'src/app/shared/services/company.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { companyProfile } from 'src/app/shared/models/apply.model';

@Component({
  templateUrl: 'companyprofile.component.html',
  styleUrls: ['./companyprofile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyProfileComponent implements OnInit {
  profileForm: FormGroup;
  public currentUsername: LoginModel;
  private email = '';

  private cd: ChangeDetectorRef;
  countries: any;
  currentValue: any;
  companyProfile: companyProfile = new companyProfile();

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
    this.cd.markForCheck();
  }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      contact_FirstName: ['', [Validators.required]],
      contact_LastName: ['', [Validators.required]],
      contact_Phone: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      email: ['', [Validators.required]],
      business_Type: ['', [Validators.required]],
      total_Asset: ['', [Validators.required]],
      rC_Number: ['', [Validators.required]],
      tin_Number: ['', [Validators.required]],
      no_Staff: ['', [Validators.required]],
      year_Incorporated: ['', [Validators.required]],
      yearly_Revenue: ['', [Validators.required]],
      no_Expatriate: ['', [Validators.required]],
    })
  }

  getCompanyProfile(email) {
    this.companyService.getCompanyProfile(email).subscribe({
      next: (res) => {
        this.companyProfile = res.data.company;
        this.countries = res.data.nations;
        console.log(this.companyProfile);

        this.countries.filter((res) => {
          if (res.text == this.companyProfile.nationality) {
            this.currentValue = { value: res.value, text: res.text };
            return res.value;
          }
        });

        this.cd.markForCheck();
      },
    });
  }

  save() {
    //this.isSubmitted = true;
    //if (this.profileForm.invalid) return;
    const userData = this.profileForm.value;
    if (userData.nationality == this.currentValue.text)
      userData.nationality = this.currentValue.value;
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
