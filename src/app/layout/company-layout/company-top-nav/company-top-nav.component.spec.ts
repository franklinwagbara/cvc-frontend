import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTopNavComponent } from './company-top-nav.component';

describe('CompanyTopNavComponent', () => {
  let component: CompanyTopNavComponent;
  let fixture: ComponentFixture<CompanyTopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyTopNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyTopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
