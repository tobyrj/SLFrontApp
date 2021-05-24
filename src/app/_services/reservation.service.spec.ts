import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ReservationService } from '../_services/reservation.service';
import { RouterTestingModule } from '@angular/router/testing';


describe('ReservationService', () => {
  let httpClient: HttpClient;
  let service: ReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
                RouterTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(ReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // does not. Is 401 Unauthorized
//   it('should retrieve reservations', (done: DoneFn) => {
//     service.getAll().subscribe(data => {
//       done();
//     });
//   });
});