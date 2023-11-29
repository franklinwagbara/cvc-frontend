import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveApplicationFormComponent } from './move-application-form.component';

describe('MoveApplicationFormComponent', () => {
  let component: MoveApplicationFormComponent;
  let fixture: ComponentFixture<MoveApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveApplicationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoveApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
