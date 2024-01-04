import { Component, OnInit, EventEmitter, Output , Input } from '@angular/core';


import { IApplication } from 'src/app/shared/interfaces/IApplication';

@Component({
  selector: 'app-filterright',
  templateUrl: './filterright.component.html',
  styleUrls: ['./filterright.component.css'],
})
export class FilterrightComponent implements OnInit {
  public selectedHeader1 = '';

  @Input() applications: IApplication[];
  @Output() searchValueChanged: EventEmitter<IApplication[]> = new EventEmitter<
    IApplication[]
  >();

  columnsHeaders: IColumnHeader[] = [
    {
      header: '',
      columDef: '--Select value--',
    },
    {
      header: 'reference',
      columDef: 'Reference Number',
    },
    {
      header: 'companyName',
      columDef: 'Company Name',
    },
    {
      header: 'companyEmail',
      columDef: 'Company Email',
    },
    {
      header: 'vesselName',
      columDef: 'Vessel Name',
    },
    {
      header: 'vesselType',
      columDef: 'Vessel Type',
    },
    {
      header: 'capacity',
      columDef: 'Capacity',
    },
    {
      header: 'status',
      columDef: 'Status',
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  onSearchValueChanged(event) {
    const searchText = event.target.value as string;
    const filteredApps = this.applications?.filter((app) =>
      (app[this.selectedHeader1] as string)
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );

    this.searchValueChanged.emit(filteredApps);
  }
}

export interface IColumnHeader {
  header: string;
  columDef: string;
}
