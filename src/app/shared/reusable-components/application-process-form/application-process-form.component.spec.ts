import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationProcessFormComponent } from './application-process-form.component';

describe('ApplicationProcessFormComponent', () => {
  let component: ApplicationProcessFormComponent;
  let fixture: ComponentFixture<ApplicationProcessFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationProcessFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationProcessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
