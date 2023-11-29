import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
  private email: string = '';

  private cd: ChangeDetectorRef;
  countries: any;
  currentValue: any;
  companyProfile: companyProfile = new companyProfile();

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
    this.cd.markForCheck();
  }

  createForm() {
    this.profileForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        contact_FirstName: new FormControl('', [Validators.required]),
        contact_LastName: new FormControl('', [Validators.required]),
        contact_Phone: new FormControl('', [Validators.required]),
        nationality: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        business_Type: new FormControl('', [Validators.required]),
        total_Asset: new FormControl('', [Validators.required]),
        rC_Number: new FormControl('', [Validators.required]),
        tin_Number: new FormControl('', [Validators.required]),
        no_Staff: new FormControl('', [Validators.required]),
        year_Incorporated: new FormControl('', [Validators.required]),
        yearly_Revenue: new FormControl('', [Validators.required]),
        no_Expatriate: new FormControl('', [Validators.required]),
      },
      {}
    );
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
    let userData = this.profileForm.value;
    if (userData.nationality == this.currentValue.text)
      userData.nationality = this.currentValue.value;
    console.log(userData);
    this.companyService.saveCompanyProfile(userData).subscribe({
      next: (res) => {
        this.popupService.open('Record updated successfully', 'success');
      },
      error: (error) => {
        console.log(error);
        this.popupService.open(error.error, 'error');
      },
    });
  }
}
