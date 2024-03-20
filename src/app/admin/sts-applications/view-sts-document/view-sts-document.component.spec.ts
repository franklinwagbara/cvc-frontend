import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStsDocumentComponent } from './view-sts-document.component';

describe('ViewStsDocumentComponent', () => {
  let component: ViewStsDocumentComponent;
  let fixture: ComponentFixture<ViewStsDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStsDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStsDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
