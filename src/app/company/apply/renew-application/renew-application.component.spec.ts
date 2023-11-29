import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewApplicationComponent } from './renew-application.component';

describe('RenewApplicationComponent', () => {
  let component: RenewApplicationComponent;
  let fixture: ComponentFixture<RenewApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
