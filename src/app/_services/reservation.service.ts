import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Reservation } from '../_models/reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    private reservationSubject: BehaviorSubject<Reservation>;
    public reservation: Observable<Reservation>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.reservationSubject = new BehaviorSubject<Reservation>(JSON.parse(localStorage.getItem('reservation')!));
        this.reservation = this.reservationSubject.asObservable();
    }

    public get reservationValue(): Reservation {
        return this.reservationSubject.value;
    }

    create(reservation: Reservation) {
        return this.http.post(`${environment.apiUrl}/reservations/create`, reservation);
    }

    getAll() {
        return this.http.get<Reservation[]>(`${environment.apiUrl}/reservations`);
    }

    getById(id: string) {
        return this.http.get<Reservation>(`${environment.apiUrl}/reservations/${id}`);
    }

    update(id: any, params: any) {
        return this.http.put(`${environment.apiUrl}/reservations/${id}`, params)
            .pipe(map(x => {
                    // update local storage
                    const reservation = { ...this.reservationValue, ...params };
                    localStorage.setItem('reservation', JSON.stringify(reservation));

                    // publish updated reservation to subscribers
                    this.reservationSubject.next(reservation);
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/reservations/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }

    getAllByUserId(userId: string) {
        return this.http.get<Reservation[]>(`${environment.apiUrl}/reservations/userid/${userId}`);
    }
}