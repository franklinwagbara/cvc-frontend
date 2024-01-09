import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqApplicationViewComponent } from './coq-application-view.component';

describe('CoqApplicationViewComponent', () => {
  let component: CoqApplicationViewComponent;
  let fixture: ComponentFixture<CoqApplicationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoqApplicationViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoqApplicationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
