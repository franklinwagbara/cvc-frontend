import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StsApplicationComponent } from './sts-application.component';

describe('StsApplicationComponent', () => {
  let component: StsApplicationComponent;
  let fixture: ComponentFixture<StsApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StsApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
