import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AccountService } from './account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../_models/user';

describe('AccountService', () => {
  let httpClient: HttpClient;
  let service: AccountService;
  let dummyUser: User = { email: 'dummy@dummy.com', password: '_maXSafetY@1224', firstName: 'Dummy', lastName: 'Dumson', bookingNumber: '#12345' }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
                RouterTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should register account', (done: DoneFn) => {
  //   service.register(dummyUser).subscribe(data => {
  //     done();
  //   });
  // });

  it('should login', (done: DoneFn) => {
    service.login('dummy@dummy.com', '_maXSafetY@1224').subscribe(data => {
      done();
    });
  });
});