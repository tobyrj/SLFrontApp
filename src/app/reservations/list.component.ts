import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ReservationService } from '../_services/reservation.service';
import { Role } from '../_models/role';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    reservations: any = null;
    user: User;

    constructor(private reservationService: ReservationService, private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
        if (this.isAdmin === true) {
            this.reservationService.getAll()
                .pipe(first())
                .subscribe(reservations => this.reservations = reservations);
        } else {
            this.reservationService.getAllByUserId(this.user.id)
                .pipe(first())
                .subscribe(reservations => this.reservations = reservations);
        }
    }

    get isAdmin() {
        return this.user && this.user.role === Role.Admin;
    }

    deleteReservation(id: string) {
        const reservation = this.reservations.find((x: any) => x.id === id);
        reservation.isDeleting = true;
        this.reservationService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.reservations = this.reservations.filter((x: any) => x.id !== id)
            });
    }
}