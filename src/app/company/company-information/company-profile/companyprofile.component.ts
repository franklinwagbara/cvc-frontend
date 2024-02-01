import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { LoginModel } from '../../../../../src/app/shared/models/login-model';
import { AuthenticationService } from '../../../../../src/app/shared/services';
import { CompanyService } from '../../../../../src/app/shared/services/company.service';
import { PopupService } from '../../../../../src/app/shared/services/popup.service';
import { companyProfile } from '../../../../../src/app/shared/models/apply.model';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

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
  operatingFacility: any;

  constructor(
    private companyService: CompanyService,
    private popupService: PopupService,
    private auth: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private spinner: SpinnerService
  ) {
    this.cd = cdr;
    this.currentUsername = this.auth.currentUser;
    this.email = this.currentUsername.userId;
    this.createForm();
    this.cd.markForCheck();
  }

  ngOnInit() {
    this.getCompanyProfile(this.email);
    this.getOperatingFacility();
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
      operating_Facility: ['', [Validators.required]],
      business_Type: ['', [Validators.required]],
      total_Asset: ['', [Validators.required]],
      rC_Number: ['', [Validators.required]],
      tin_Number: ['', [Validators.required]],
      no_Staff: ['', [Validators.required]],
      year_Incorporated: ['', [Validators.required]],
      yearly_Revenue: ['', [Validators.required]],
      no_Expatriate: ['', [Validators.required]],
    });
  }

  getOperatingFacility() {
    this.companyService.getOperatingFacilities().subscribe({
      next: (res) => {
        this.operatingFacility = res.data;
      },
    });
  }

  getCompanyProfile(email) {
    //this.spinner.show('Loading company profile');
    this.companyService.getCompanyProfile(email).subscribe({
      next: (res) => {
        this.spinner.close();
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
      error: (error) => {
        this.spinner.close();
      },
    });
  }

  save() {
    //this.isSubmitted = true;
    //if (this.profileForm.invalid) return;
    this.spinner.show('Saving company profile');
    const userData = {} as any;
    // if (userData.nationality == this.currentValue.text)
    //userData.nationality = this.currentValue.value;
    userData.company = this.profileForm.value;
    console.log(userData);
    this.companyService.updateCompanyProfile(userData).subscribe({
      next: (res) => {
        this.spinner.close();
        this.popupService.open('Record updated successfully', 'success');
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.close();
        this.popupService.open(error?.error, 'error');
      },
    });
  }
}
