import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStageDocsComponent } from './app-stage-docs.component';

describe('AppStageDocsComponent', () => {
  let component: AppStageDocsComponent;
  let fixture: ComponentFixture<AppStageDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppStageDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppStageDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
