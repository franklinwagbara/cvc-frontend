import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankFormComponent } from './tank-form.component';

describe('TankFormComponent', () => {
  let component: TankFormComponent;
  let fixture: ComponentFixture<TankFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TankFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TankFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
