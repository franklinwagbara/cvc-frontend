import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoaApplicationsComponent } from './noa-applications.component';

describe('NoaApplicationsComponent', () => {
  let component: NoaApplicationsComponent;
  let fixture: ComponentFixture<NoaApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoaApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoaApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
