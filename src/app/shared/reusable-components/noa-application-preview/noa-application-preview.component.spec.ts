import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoaApplicationPreviewComponent } from './noa-application-preview.component';

describe('NoaApplicationPreviewComponent', () => {
  let component: NoaApplicationPreviewComponent;
  let fixture: ComponentFixture<NoaApplicationPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoaApplicationPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoaApplicationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
