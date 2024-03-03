import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingsModalComponent } from './readings-modal.component';

describe('ReadingsModalComponent', () => {
  let component: ReadingsModalComponent;
  let fixture: ComponentFixture<ReadingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadingsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
