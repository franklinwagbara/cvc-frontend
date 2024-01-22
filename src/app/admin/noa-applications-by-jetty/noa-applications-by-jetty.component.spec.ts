import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoaApplicationsByJettyComponent } from './noa-applications-by-jetty.component';

describe('NoaApplicationsByJettyComponent', () => {
  let component: NoaApplicationsByJettyComponent;
  let fixture: ComponentFixture<NoaApplicationsByJettyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoaApplicationsByJettyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoaApplicationsByJettyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
