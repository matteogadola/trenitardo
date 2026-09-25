import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Trenitardo',
    loadComponent: () => import('app/features/home/home-page').then((c) => c.HomePage),
  },
  {
    path: 'runs',
    pathMatch: 'full',
    title: 'Trenitardo',
    loadComponent: () => import('app/features/runs/runs-page').then((c) => c.RunsPage),
  },
  {
    path: 'login',
    title: 'Accedi | Trenitardo',
    loadComponent: () => import('app/features/auth/login').then((c) => c.Login),
  },
  {
    path: 'admin',
    title: 'Admin | Trenitardo',
    canActivate: [authGuard, roleGuard('admin')],
    loadComponent: () => import('app/features/admin/admin-page').then((c) => c.AdminPage),
  },
  { path: '**', redirectTo: '' },
];
