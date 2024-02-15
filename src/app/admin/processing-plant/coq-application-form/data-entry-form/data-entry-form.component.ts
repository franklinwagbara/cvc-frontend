import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MeasurementSystem } from '../helpers/Types';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IDipMethod } from '../coq-application-pp-form.component';
import { Subscription } from 'rxjs';
import { GasDataStaticEntryComponent } from '../gas-data-static-entry/gas-data-static-entry.component';
import { LiquidDataStaticEntryComponent } from '../liquid-data-static-entry/liquid-data-static-entry.component';
import { GasDataDynamicEntryComponent } from '../gas-data-dynamic-entry/gas-data-dynamic-entry.component';
import { LiquidDataDynamicEntryComponent } from '../liquid-data-dynamic-entry/liquid-data-dynamic-entry.component';
import { METER_COL_MAPPINGS, TANK_COL_MAPPINGS } from '../../colMappings';
import { ProcessingPlantContextService } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { BatchService } from 'src/app/shared/services/batch.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { MatStep } from '@angular/material/stepper';
import { CondensateDataStaticEntryComponent } from '../condensate-data-static-entry/condensate-data-static-entry.component';
import { CondensateDataDynamicEntryComponent } from '../condensate-data-dynamic-entry/condensate-data-dynamic-entry.component';

@Component({
  selector: 'app-data-entry-form',
  templateUrl: './data-entry-form.component.html',
  styleUrls: ['./data-entry-form.component.css'],
})
export class DataEntryFormComponent implements OnInit, OnDestroy {
  @Input() isGas: boolean;
  @Input() productType: 'Gas' | 'Liquid' | 'Condensate';
  @Input() selectedMeasurementSystem: MeasurementSystem;
  @Input() selectedProduct: IProduct;
  @Input() selectedMeterType: any;
  @Input() selectedDipMethod: IDipMethod;

  @ViewChild('dataEntryForms', { read: ViewContainerRef })
  dataEntryContainer: ViewContainerRef;

  @ViewChild('batchStepper') batchStepper: MatStep;

  public batchSelectionForm: FormControl = new FormControl(
    '',
    Validators.required
  );

  public tankForm = this.fb.group({
    // id: ['', [Validators.required, this.isUniqueTank()]],
    id: ['', [Validators.required]],
    // name: ['', [Validators.required]],
  });

  public meterForm = this.fb.group({
    // id: ['', [Validators.required, this.isUniqueTank()]],
    id: ['', [Validators.required]],
  });

  public tankColMappings = TANK_COL_MAPPINGS;
  public meterColMappings = METER_COL_MAPPINGS;

  public batches: IBatch[];

  public allSubscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private batchService: BatchService,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef,
    private popUp: PopupService,
    public ppContext: ProcessingPlantContextService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.getBatches();
    this.initSubscriptions();
  }

  public setUpDataEntry() {
    this.dataEntryContainer = this.viewContainerRef;
    debugger;
    if (this.selectedMeasurementSystem == 'Static') {
      if (this.productType === 'Gas') {
        this.dataEntryContainer.clear();
        let component = this.dataEntryContainer.createComponent(
          GasDataStaticEntryComponent
        );

        component.instance.batchStepper = this.batchStepper;
      } else if (this.productType === 'Liquid') {
        this.dataEntryContainer.clear();
        let component = this.dataEntryContainer.createComponent(
          LiquidDataStaticEntryComponent
        );

        component.instance.batchStepper = this.batchStepper;
      } else if (this.productType === 'Condensate') {
        this.dataEntryContainer.clear();
        let component = this.dataEntryContainer.createComponent(
          CondensateDataStaticEntryComponent
        );

        component.instance.batchStepper = this.batchStepper;
      }
    } else {
      if (this.productType === 'Gas') {
        this.dataEntryContainer.clear();

        let component = this.dataEntryContainer.createComponent(
          GasDataDynamicEntryComponent
        );

        component.instance.batchStepper = this.batchStepper;
      } else if (this.productType === 'Liquid') {
        if (!this.dataEntryContainer) return;

        this.dataEntryContainer.clear();

        let component = this.dataEntryContainer.createComponent(
          LiquidDataDynamicEntryComponent
        );

        component.instance.batchStepper = this.batchStepper;
      } else if (this.productType === 'Condensate') {
        this.dataEntryContainer.clear();
        let component = this.dataEntryContainer.createComponent(
          CondensateDataDynamicEntryComponent
        );

        component.instance.batchStepper = this.batchStepper;
      }
    }
    this.cd.markForCheck();
  }

  private initSubscriptions() {
    this.subscribeBatchSelection();
    this.subscribeTankSelection();
    this.subscribeMeterSelection();
  }

  public getBatches() {
    this.spinner.open();
    this.cd.markForCheck();
    this.batchService.getAll().subscribe({
      next: (res) => {
        this.batches = res.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (res) => {
        this.popUp.open(res.message, 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  public subscribeBatchSelection() {
    this.allSubscriptions.add(
      this.batchSelectionForm.valueChanges.subscribe((v) => {
        const batch = this.batches?.find((x) => x.batchId == +v);
        this.ppContext.selectedBatch$.next(batch);
      })
    );
  }

  public subscribeTankSelection() {
    this.allSubscriptions.add(
      this.tankForm.controls['id'].valueChanges.subscribe((v) => {
        const selectedTank = this.ppContext.configuredTanks$.value.find(
          (x) => x.plantTankId == +v
        );
        this.ppContext.selectedTank$.next(selectedTank);
      })
    );
  }

  public subscribeMeterSelection() {
    this.allSubscriptions.add(
      this.meterForm.controls['id'].valueChanges.subscribe((v) => {
        const selectedMeter = this.ppContext.configuredMeters$.value.find(
          (x) => x.id == +v
        );
        this.ppContext.selectedMeter$.next(selectedMeter);
      })
    );
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
  }
}

export interface IBatch {
  batchId: number;
  name: string;
  deletedAt: string;
}
