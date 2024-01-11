import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoaApplicationsByDepotComponent } from './noa-applications-by-depot.component';

describe('NoaApplicationsByDepotComponent', () => {
  let component: NoaApplicationsByDepotComponent;
  let fixture: ComponentFixture<NoaApplicationsByDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoaApplicationsByDepotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoaApplicationsByDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
