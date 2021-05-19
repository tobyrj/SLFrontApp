import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers/auth-guard';
import { AdminComponent } from './admin/admin.component';
import { Role } from './_models/role';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const reservationsModule = () => import('./reservations/reservations.module').then(x => x.ReservationsModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
  { path: 'reservations', loadChildren: reservationsModule, canActivate: [AuthGuard] },

      // otherwise redirect to home
      { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
