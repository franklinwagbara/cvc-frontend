import { Component, OnInit } from '@angular/core';
import { IDepot } from 'src/app/shared/interfaces/IDepot';
import { IDepotOfficer } from 'src/app/shared/interfaces/IDepotOfficer';
import { IUser } from 'src/app/shared/interfaces/IUser';

@Component({
  selector: 'app-field-officer-setting',
  templateUrl: './field-officer-setting.component.html',
  styleUrls: ['./field-officer-setting.component.css']
})
export class FieldOfficerSettingComponent implements OnInit {
  fieldOfficers: IDepotOfficer[];
  fieldOfficerUsers: IUser[];
  fieldOfficerDepots: IDepot[];

  fieldOfficersData: FieldOfficer[]
  
  officerKeysMappedToHeaders: any = {
    name: 'Name',
    email: 'Email',
    phoneNumber: 'Phone',
    role: 'Role',
    office: 'Office',
    location: 'Location',
    isActive: 'Status'
  }

  constructor() {}

  ngOnInit(): void {
    
  }

  onAddData(event: Event, s) {

  }

  onDeleteData(event: Event, s) {

  }

  onEditData(event: Event, s) {

  }

}

interface FieldOfficer {
  name: string,
  email: string,
  phoneNumber: string,
  role: string,
  office: string,
  location: string,
  status: string
}