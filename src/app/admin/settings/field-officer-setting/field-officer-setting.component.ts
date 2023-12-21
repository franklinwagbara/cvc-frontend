import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDepot } from 'src/app/shared/interfaces/IDepot';
import { IDepotOfficer } from 'src/app/shared/interfaces/IDepotOfficer';
import { IRole } from 'src/app/shared/interfaces/IRole';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { UserFormComponent } from 'src/app/shared/reusable-components/user-form/user-form.component';

@Component({
  selector: 'app-field-officer-setting',
  templateUrl: './field-officer-setting.component.html',
  styleUrls: ['./field-officer-setting.component.css']
})
export class FieldOfficerSettingComponent implements OnInit {
  fieldOfficers: IDepotOfficer[];
  fieldOfficerUsers: IUser[];
  fieldOfficerDepots: IDepot[];
  roles: IRole[];
  locations: any[];
  offices: any[];

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

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    
  }

  addData() {
    const data = {
      data: {
        users: this.fieldOfficerUsers,
        staffList: this.fieldOfficers,
        roles: this.roles,
        offices: this.offices,
      }
    }
    const dialogRef = this.dialog.open(UserFormComponent, { data });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {

      }
    })
  }

  deleteData(event: Event) {

  }

  editData(event: Event) {
    const data = {
      data: {
        users: this.fieldOfficerUsers,
        staffList: this.fieldOfficers,
        roles: this.roles,
        offices: this.offices,
        currentValue: ''
      }
    }
    const dialogRef = this.dialog.open(UserFormComponent, { data });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {

      }
    })
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