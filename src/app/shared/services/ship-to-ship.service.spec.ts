import { TestBed } from '@angular/core/testing';

import { ShipToShipService } from './ship-to-ship.service';

describe('ShipToShipService', () => {
  let service: ShipToShipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipToShipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
