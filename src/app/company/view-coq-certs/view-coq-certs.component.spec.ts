import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoqCertsComponent } from './view-coq-certs.component';

describe('ViewCoqCertsComponent', () => {
  let component: ViewCoqCertsComponent;
  let fixture: ComponentFixture<ViewCoqCertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCoqCertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCoqCertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
