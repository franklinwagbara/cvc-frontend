import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicationInFullComponent } from './view-application-in-full.component';

describe('ViewApplicationInFullComponent', () => {
  let component: ViewApplicationInFullComponent;
  let fixture: ComponentFixture<ViewApplicationInFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApplicationInFullComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewApplicationInFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
