import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientsViewComponent } from './recipients-view.component';

describe('RecipientsViewComponent', () => {
  let component: RecipientsViewComponent;
  let fixture: ComponentFixture<RecipientsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipientsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipientsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
