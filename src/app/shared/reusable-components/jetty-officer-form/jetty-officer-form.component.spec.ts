import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JettyOfficerFormComponent } from './jetty-officer-form.component';

describe('JettyOfficerFormComponent', () => {
  let component: JettyOfficerFormComponent;
  let fixture: ComponentFixture<JettyOfficerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JettyOfficerFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JettyOfficerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
