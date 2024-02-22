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
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LibaryService } from 'src/app/shared/services/libary.service';

@Component({
  templateUrl: 'companyprofile.component.html',
  styleUrls: ['./companyprofile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyProfileComponent implements OnInit {
  profileForm: FormGroup;
  public currentUser: LoginModel;
  private email = '';

  public operatingFacilities: IoperatingFacility[];

  countries: any;
  currentValue: any;
  companyProfile: companyProfile = new companyProfile();
  registeredAddress: any;
  operatingFacility: any;

  constructor(
    private companyService: CompanyService,
    private popupService: PopupService,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private spinner: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private libaryService: LibaryService
  ) {
    this.currentUser = this.auth.currentUser;
    this.email = this.currentUser.userId;
    this.createForm();
    this.cd.markForCheck();
  }

  ngOnInit() {
    this.getOperatingFacilities();
    this.getCompanyProfile(this.email);
    this.getMyOperatingFacility();
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
      registered_Address_Id: [''],
      operational_Address_Id: [''],
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
    });
  }

  getOperatingFacilities() {
    this.libaryService.getOperatingFacilities().subscribe({
      next: (res) => {
        this.operatingFacilities = res.data;
        if (this.currentUser.operationFacility) {
          const getOperatingFacilityId = this.operatingFacilities.find(
            (x) => x.name === this.currentUser.operationFacility
          );
          this.profileForm
            .get('operatingFacilityId')
            .setValue(getOperatingFacilityId.value);
        }
        this.cd.markForCheck();
      },
    });
  }

  getMyOperatingFacility() {
    // this.companyService.getOperatingFacility(this.email).subscribe({
    //   next: (res) => {
    //     this.operatingFacility = res.data;
    //     var tag = document.getElementById('operatingFacilityId');
    //     var selectedOF = this.operatingFacilities.find(
    //       (x) => x.name == this.operatingFacility?.name
    //     );
    //     this.operatingFacilities.forEach((o) => {
    //       if (
    //         (tag as HTMLSelectElement).options.item(o.value).value ==
    //         selectedOF?.name
    //       )
    //         (tag as HTMLSelectElement).options.item(o.value).selected = true;
    //     });
    //   },
    // });
  }

  onChangeOperatingFacility(event) {
    this.createOperationFacility(event.target.value);
  }

  createOperationFacility(value) {
    // this.spinner.open();
    this.companyService
      .createOperatingFacilities({
        id: 0,
        companyEmail: this.email,
        name: value,
      })
      .subscribe({
        next: (res) => {
          this.operatingFacility = res.data;
          this.spinner.close();
          // this.popupService.open('Record updated successfully', 'success');
          this.cd.markForCheck();
        },
        error: (error: any) => {
          this.spinner.close();
          // this.popupService.open('Unable to update record', 'error');
          this.cd.markForCheck();
        },
      });
  }

  getCompanyProfile(email) {
    //this.spinner.show('Loading company profile');
    this.companyService.getCompanyProfile(email.toLowerCase()).subscribe({
      next: (res) => {
        this.spinner.close();
        this.companyProfile = res.data.company;
        this.countries = res.data.nations;
        this.registeredAddress = res.data.registeredAddress;
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
    // this.isSubmitted = true;
    if (this.profileForm.invalid) return;
    this.spinner.show('Saving company profile');
    const userData = {
      ...this.profileForm.value,
      operatingFacilityId: this.operatingFacility?.id,
    };

    forkJoin([
      this.companyService.updateCompanyProfile(userData, this.email),
      this.companyService.createOperatingFacilities({
        id: 0,
        companyEmail: this.email,
        name: this.profileForm.get('operatingFacilityId').value,
      }),
    ]).subscribe({
      next: (res) => {
        this.spinner.close();
        this.popupService.open('Record updated successfully', 'success');
        const data: LoginModel = res[0].data;
        this.currentUser.operationFacility = res[1].data.name;
        this.currentUser.profileComplete = data?.profileComplete;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          window.location.assign(returnUrl);
          // } else if (this.registeredAddress == null) {
          //   window.location.assign('company/companyinformation/companyaddress');
        } else {
          window.location.reload();
        }

        this.cd.markForCheck();
      },
      error: (error: any) => {
        this.spinner.close();
        this.popupService.open('Unable to update profile', 'error');

        this.cd.markForCheck();
      },
    });
  }
}

class IoperatingFacility {
  name: string;
  value: number;
}
