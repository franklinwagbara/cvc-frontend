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
import { OperatingFacility } from '../../company.component';

@Component({
  templateUrl: 'companyprofile.component.html',
  styleUrls: ['./companyprofile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyProfileComponent implements OnInit {
  profileForm: FormGroup;
  public currentUsername: LoginModel;
  private email = '';
  public OperatingFacility = [
    { name: OperatingFacility.CVC, value: 0 },
    { name: OperatingFacility.ProcessingPlant, value: 1 },
    { name: OperatingFacility.Both, value: 2 },
  ];

  countries: any;
  currentValue: any;
  companyProfile: companyProfile = new companyProfile();
  operatingFacility: any;

  constructor(
    private companyService: CompanyService,
    private popupService: PopupService,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private spinner: SpinnerService
  ) {
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
      user_Id: [''],
      name: ['', [Validators.required]],
      contact_FirstName: ['', [Validators.required]],
      contact_LastName: ['', [Validators.required]],
      contact_Phone: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      registered_Address_Id: ['', [Validators.required]],
      operational_Address_Id: ['', [Validators.required]],
      email: ['', [Validators.required]],
      operatingFacilityId: ['', [Validators.required]],
      business_Type: ['', [Validators.required]],
      total_Asset: ['', [Validators.required]],
      rC_Number: ['', [Validators.required]],
      tin_Number: ['', [Validators.required]],
      no_Staff: ['', [Validators.required]],
      year_Incorporated: ['', [Validators.required]],
      yearly_Revenue: ['', [Validators.required]],
      no_Expatriate: ['', [Validators.required]],
      affiliate: [''],
      accident: [''],
      accident_Report: [''],
      training_Program: [''],
      mission_Vision: [''],
      hse: [''],
      hseDoc: [''],
      date: [''],
      isCompleted: [''],
      elps_Id: [''],
      oldemail: ['mymail@gmail.com'],
      // id: [''],
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
        this.cd.markForCheck();
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
    const userData = this.profileForm.value;
    console.log(userData);
    this.companyService.updateCompanyProfile(userData).subscribe({
      next: (res) => {
        this.spinner.close();
        this.popupService.open('Record updated successfully', 'success');
        this.cd.markForCheck();
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.close();
        this.popupService.open('Unable to update profile', 'error');
        this.cd.markForCheck();
      },
    });
  }
}
