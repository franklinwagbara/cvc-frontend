import {
  Component,
  OnInit,
  Input,
  OnChanges,
  AfterViewInit,
  ViewChild,
  SimpleChanges,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { ITableKeysMappedToHeaders } from '../../../../../src/app/shared/interfaces/ITableKeysMappedToHeaders';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Application } from '../../../../../src/app/company/my-applications/myapplication.component';
import { Staff } from '../../../../../src/app/admin/settings/all-staff/all-staff.component';
import { IApplication } from '../../interfaces/IApplication';

interface IColumn {
  columnDef: string;
  header: string;
  cell: (element: object) => string;
}

const PAGESIZEOPTIONS = [2, 5, 10];
const PAGESIZE = 10;

@Component({
  selector: 'generic-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() flat = false;
  @Input() enableMoveApplication = false;
  @Input() enableGenerateRRR = false;
  @Input() enableConfirmPayment = false;
  @Input() enableUploadDocument = false;
  @Input() enableViewTank: boolean = false;
  @Input('title-color') titleColorProp?: string = 'slate';
  @Input() noTitle = false;
  @Input() noControls?: boolean = false;
  @Input() noFilter?: boolean = false;
  @Input() noAddOrDeleteButton?: boolean = false;
  @Input() noAddButton?: boolean = false;
  @Input() noDeleteButton?: boolean = false;
  @Input() noCheckControls?: boolean = false;
  @Input() noEditControl?: boolean = false;
  @Input('EnableViewControl') enableViewControl?: boolean = false;
  @Input('EnableInitiateCoQControl') enableInitiateCoQControl?: boolean = false;
  @Input('EnableViewCertificateControl')
  enableViewCertificateControl?: boolean = false;
  @Input('EnableViewScheduleControl') enableViewScheduleControl?: boolean =
    false;
  @Input('EnableViewCoQCertsControl') enableViewCoQCertsControl?: boolean =
    false;
  @Input('EnableViewDebitNotesControl') enableViewDebitNotesControl?: boolean =
    false;
  @Input('EnableViewCoQCertControl') enableViewCoQCertControl?: boolean = false;
  @Input('EnableViewDebitNoteControl') enableViewDebitNoteControl?: boolean =
    false;
  @Input('table_keysMappedToHeaders')
  keysMappedToHeaders: ITableKeysMappedToHeaders|any = {};
  @Input() table_controls_horizontal = false;
  @Input('table_title') title = 'Title';
  @Input('table_content') items: any[] = [];
  @Output() onAddData = new EventEmitter<any>();
  @Output() onDeleteData = new EventEmitter<any>();
  @Output() onEditData = new EventEmitter<any>();
  @Output() onInitiateCoQ = new EventEmitter<any>();
  @Output() onViewData = new EventEmitter<any>();
  @Output() onViewCoQCerts = new EventEmitter<any>();
  @Output() onViewCoQCert = new EventEmitter<any>();
  @Output() onViewDebitNotes = new EventEmitter<any>();
  @Output() onViewDebitNote = new EventEmitter<any>();
  @Output() onGenerateRRR = new EventEmitter<any>();
  @Output() onConfirmPayment = new EventEmitter<any>();
  @Output() onUploadDocument = new EventEmitter<any>();
  @Output() onFileUpload = new EventEmitter<any>();
  @Output() onViewTank = new EventEmitter<any>();
  @Output() onMoveApplication = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tableControls') tableControlsDiv: ElementRef;

  public titleColor = 'slate';

  public divFlexDirection = 'column';

  public headers: string[];
  public keys: string[];
  public columns: IColumn[];
  public displayedColumns: string[];

  //MatPaginator variables declarations
  public pageSize: number = PAGESIZE;
  public pageSizeOptions: number[] = [...PAGESIZEOPTIONS];
  public length = 100;
  public pageEvent: PageEvent;

  public dataSource = new MatTableDataSource<any>(this.items);
  public selection = new SelectionModel<any>(true, []);

  ngOnInit(): void {
    this.initialComponents();
  }

  private initialComponents() {
    this.headers = Object.values(this.keysMappedToHeaders);
    this.keys = Object.keys(this.keysMappedToHeaders);

    this.columns = this.keys.map((key) => {
      return {
        columnDef: key,
        header: this.keysMappedToHeaders[key],
        cell: (item) => `${item[key]}`,
      };
    });

    if (this.enableMoveApplication) {
      this.columns.push({
        columnDef: 'action_controls',
        header: 'Application Control',
        cell: (item: Staff) => {
          if (item.appCount > 0) return 'moveApplication_control';
          else return '';
        },
      });
    }

    if (this.enableInitiateCoQControl) {
      this.columns.push({
        columnDef: 'action_controls',
        header: '',
        cell: (item: IApplication) => {
          if (item) return 'initiate_coq_control';
          else return '';
        },
      });
    }

    if (
      this.enableUploadDocument ||
      this.enableConfirmPayment ||
      this.enableGenerateRRR
    ) {
      this.columns.push({
        columnDef: 'action_controls',
        header: 'Action Controls',
        cell: (item: Application) => {
          if (item.rrr && item.paymentStatus === 'Processing') return '';
          else if (
            item.rrr &&
            item.paymentStatus === 'Payment confirmed' &&
            item.status !== 'Processing' &&
            item.status !== 'Completed'
          )
            return 'uploadDocument_control';
          else if (item.rrr && item.paymentStatus !== 'Payment confirmed')
            return 'confirmPayment_control';
          else if (!item.rrr) return 'rrr_control';
          else return '';
        },
      });
    }

    if (!this.noEditControl) {
      this.columns.push({
        columnDef: 'edit_control',
        header: '',
        cell: (item) => 'edit_control',
      });
    }

    if (this.enableViewControl) {
      this.columns.push({
        columnDef: 'view_control',
        header: '',
        cell: (item) => 'view_control',
      });
    }

    if (this.enableViewCertificateControl) {
      this.columns.push({
        columnDef: 'view_control',
        header: '',
        cell: (item) => 'view_certificate_control',
      });
    }

    if (this.enableViewScheduleControl) {
      this.columns.push({
        columnDef: 'view_control',
        header: '',
        cell: (item) => 'view_schedule_control',
      });
    }

    if (this.enableViewCoQCertsControl) {
      this.columns.push({
        columnDef: 'view_coq_certs_control',
        header: '',
        cell: (item) => 'view_coq_certs_control',
      });
    }

    if (this.enableViewDebitNotesControl) {
      this.columns.push({
        columnDef: 'view_debit_notes_control',
        header: '',
        cell: (item) => 'view_debit_notes_control',
      });
    }

    if (this.enableViewCoQCertControl) {
      this.columns.push({
        columnDef: 'view_coq_cert_control',
        header: '',
        cell: (item) => 'view_coq_cert_control',
      });
    }

    if (this.enableViewDebitNoteControl) {
      this.columns.push({
        columnDef: 'view_debit_note_control',
        header: '',
        cell: (item) => 'view_debit_note_control',
      });
    }

    this.columns.unshift({
      columnDef: 'select',
      header: '',
      cell: (element) => ``,
    });

    this.displayedColumns = this.columns.map((c) => c.columnDef);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initialComponents();

    //this.dataSource.setData(this.items);
    this.dataSource.data = this.items;
  }

  fileUpload(file, row) {
    this.onFileUpload.emit({ file, doc: row });
  }

  viewTank(row) {
    this.onViewTank.emit(row);
  }

  generateRRR(row) {
    this.onGenerateRRR.emit(row);
  }

  confirmPayment(row) {
    this.onConfirmPayment.emit(row);
  }

  uploadDocument(row) {
    this.onUploadDocument.emit(row);
  }

  moveApplication(row) {
    this.onMoveApplication.emit(row);
  }

  addData() {
    //Does something before calling onAddData
    this.onAddData.emit();
  }

  deleteData() {
    // console.log('Selection', this.selection, this.dataSource.data, this.items);
    this.onDeleteData.emit(this.selection.selected);
    this.toggleAllRows();
    this.toggleAllRows();
  }

  editData(row) {
    this.onEditData.emit(row);
  }

  viewData(row: any) {
    this.onViewData.emit(row);
  }

  viewDebitNotes(row: any) {
    this.onViewDebitNotes.emit(row);
  }

  viewCoQCerts(row: any) {
    this.onViewCoQCerts.emit(row);
  }

  viewCoQCert(row: any) {
    this.onViewCoQCert.emit(row);
  }

  viewDebitNote(row: any) {
    this.onViewDebitNote.emit(row);
  }

  initiateCoQ(row: any) {
    this.onInitiateCoQ.emit(row);
  }

  onSelectChange() {
    this.onSelect.emit(this.selection.selected);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  ngAfterViewInit() {
    this.titleColor = this.titleColorProp ? this.titleColorProp : 'slate';
    this.titleColor = `table-title ${this.titleColor}`;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }
}

class MyDataSource extends DataSource<any> {
  private _dataStream = new ReplaySubject<any[]>();

  constructor(initialData: any[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<any[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: any[]) {
    this._dataStream.next(data);
  }
}
