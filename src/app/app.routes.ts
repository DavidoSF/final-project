import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'appointments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/appointments/appointments-list/appointments-list.component').then(
        (m) => m.AppointmentsListComponent
      )
  },
  {
    path: 'appointments/create',
    canActivate: [authGuard, roleGuard('Staff')],
    loadComponent: () =>
      import('./features/appointments/appointment-create/appointment-create.component').then(
        (m) => m.AppointmentCreateComponent
      )
  },
  {
    path: 'appointments/:id/status',
    canActivate: [authGuard, roleGuard('Staff')],
    loadComponent: () =>
      import('./features/appointments/appointment-status/appointment-status.component').then(
        (m) => m.AppointmentStatusComponent
      )
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
