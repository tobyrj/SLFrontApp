import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Lounger } from '../_models/lounger';

@Injectable({ providedIn: 'root' })
export class LoungerService {
    private loungerSubject: BehaviorSubject<Lounger>;
    public lounger: Observable<Lounger>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.loungerSubject = new BehaviorSubject<Lounger>(JSON.parse(localStorage.getItem('lounger')!));
        this.lounger = this.loungerSubject.asObservable();
    }

    public get loungerValue(): Lounger {
        return this.loungerSubject.value;
    }

    create(lounger: Lounger) {
        return this.http.post(`${environment.apiUrl}/loungers/create`, lounger);
    }

    getAll() {
        return this.http.get<Lounger[]>(`${environment.apiUrl}/loungers`);
    }

    getById(id: string) {
        return this.http.get<Lounger>(`${environment.apiUrl}/loungers/${id}`);
    }

    update(id: any, params: any) {
        return this.http.put(`${environment.apiUrl}/loungers/${id}`, params)
            .pipe(map(x => {
                    // update local storage
                    const lounger = { ...this.loungerValue, ...params };
                    localStorage.setItem('lounger', JSON.stringify(lounger));

                    // publish updated lounger to subscribers
                    this.loungerSubject.next(lounger);
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/loungers/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }

    getAllByUserId(userId: string) {
        return this.http.get<Lounger[]>(`${environment.apiUrl}/loungers/userid/${userId}`);
    }
}