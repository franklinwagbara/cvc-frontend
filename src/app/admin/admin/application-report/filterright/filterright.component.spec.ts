import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterrightComponent } from './filterright.component';

describe('FilterrightComponent', () => {
  let component: FilterrightComponent;
  let fixture: ComponentFixture<FilterrightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterrightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
