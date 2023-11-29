import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBackFormComponent } from './send-back-form.component';

describe('SendBackFormComponent', () => {
  let component: SendBackFormComponent;
  let fixture: ComponentFixture<SendBackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendBackFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SendBackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
