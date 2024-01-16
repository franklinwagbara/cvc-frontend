import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfigFormComponent } from './email-config-form.component';

describe('EmailConfigFormComponent', () => {
  let component: EmailConfigFormComponent;
  let fixture: ComponentFixture<EmailConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailConfigFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
