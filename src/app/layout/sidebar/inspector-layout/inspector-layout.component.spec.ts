import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectorLayoutComponent } from './inspector-layout.component';

describe('InspectorLayoutComponent', () => {
  let component: InspectorLayoutComponent;
  let fixture: ComponentFixture<InspectorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectorLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
