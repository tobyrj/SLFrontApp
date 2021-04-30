import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    user: User;
    userFromApi!: User;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
        this.loading = true;
        this.accountService.getById(this.user.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
    }
}