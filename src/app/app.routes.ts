import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
    path: 'services',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/services/list/services-list.component').then((m) => m.ServicesListComponent)
  },
  {
    path: 'services/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/services/form/service-form.component').then((m) => m.ServiceFormComponent)
  },
  {
    path: 'services/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/services/form/service-form.component').then((m) => m.ServiceFormComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
