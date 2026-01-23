import { Routes } from '@angular/router';

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
  { path: '**', redirectTo: '' },
];
