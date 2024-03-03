import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcoqApplicationViewComponent } from './ppcoq-application-view.component';

describe('PpcoqApplicationViewComponent', () => {
  let component: PpcoqApplicationViewComponent;
  let fixture: ComponentFixture<PpcoqApplicationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpcoqApplicationViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpcoqApplicationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
