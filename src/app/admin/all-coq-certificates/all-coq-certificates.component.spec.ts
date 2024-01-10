import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCoqCertificatesComponent } from './all-coq-certificates.component';

describe('AllCoqCertificatesComponent', () => {
  let component: AllCoqCertificatesComponent;
  let fixture: ComponentFixture<AllCoqCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCoqCertificatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCoqCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
