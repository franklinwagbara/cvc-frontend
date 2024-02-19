import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StsApplicationsComponent } from './sts-applications.component';

describe('StsApplicationsComponent', () => {
  let component: StsApplicationsComponent;
  let fixture: ComponentFixture<StsApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StsApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StsApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
