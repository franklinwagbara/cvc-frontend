import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotOfficerFormComponent } from './depot-officer-form.component';

describe('DepotOfficerFormComponent', () => {
  let component: DepotOfficerFormComponent;
  let fixture: ComponentFixture<DepotOfficerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotOfficerFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepotOfficerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
