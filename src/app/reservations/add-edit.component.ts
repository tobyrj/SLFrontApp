import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ReservationService } from '../_services/reservation.service';
import { AlertService } from '../_services/alert.service';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { Reservation } from '../_models/reservation';
import { LoungerService } from '../_services/lounger.service';
import { Lounger } from '../_models/lounger';

@Component({ templateUrl: 'add-edit.component.html' })

export class AddEditComponent implements OnInit {
    reservationForm!: FormGroup;
    reservationId!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;
    user: User;
    reservation!: Reservation;
    loungersFromApi!: Lounger[];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private reservationService: ReservationService,
        private alertService: AlertService,
        private accountService: AccountService,
        private loungerService: LoungerService
    ) {
        this.user = this.accountService.userValue;
    }


    ngOnInit() {
        this.reservationId = this.route.snapshot.params['reservationId'];
        this.isAddMode = !this.reservationId;

        this.loungerService.getAll()
            .pipe(first())
            .subscribe(x => this.loungersFromApi = x);

        this.reservationForm = this.formBuilder.group({
            date: ['', Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            userId: [this.user.id],
            loungers: this.formBuilder.array([], Validators.required)
        });

        // subscription to get data about a reservation by ID for updating - Not relevant to creation of a res
        if (!this.isAddMode) {
            this.reservationService.getById(this.reservationId)
                .pipe(first())
                .subscribe(x => {
                    this.fc.date.setValue(x.date);
                    this.fc.startTime.setValue(x.startTime);
                    this.fc.endTime.setValue(x.endTime);
                    this.fc.userId.setValue(x.userId);
                    this.fc.loungers.setValue(x.loungers);
                });
        }
    }

    onCheckboxChange(e: any) {
        const loungers: FormArray = this.reservationForm.get('loungers') as FormArray;

        if (e.target.checked) {

            const item = this.loungersFromApi.find(x => x.id == e.target.value);
            if (item) {

                loungers.push(this.formBuilder.group(item));
            }
        } else {
            let i: number = 0;
            // FormControl ændret til AbstractControl ??
            loungers.controls.forEach((item: AbstractControl) => {
                if (item.value.id == e.target.value) {
                    loungers.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

    // convenience getter for easy access to form fields
    get fc() { return this.reservationForm.controls; }


    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.reservationForm.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createReservation();
        } else {
            this.updateReservation();
        }
    }


    private createReservation() {
        this.reservationService.create(this.reservationForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Reservation added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }


    private updateReservation() {
        this.reservationService.update(this.reservationId, this.reservationForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}