import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqApplicationPreviewComponent } from './coq-application-preview.component';

describe('CoqApplicationPreviewComponent', () => {
  let component: CoqApplicationPreviewComponent;
  let fixture: ComponentFixture<CoqApplicationPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoqApplicationPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoqApplicationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
