import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateOfQuantityComponent } from './certificate-of-quantity.component';

describe('CertificateOfQuantityComponent', () => {
  let component: CertificateOfQuantityComponent;
  let fixture: ComponentFixture<CertificateOfQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateOfQuantityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateOfQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
