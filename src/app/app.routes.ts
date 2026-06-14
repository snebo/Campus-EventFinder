import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { AppShellComponent } from './layout/app-shell/app-shell.component';

export const routes: Routes = [
  {
    path: 'sign-up',
    loadChildren: () => import('./features/auth/sign-up/signup-page.routes').then((m) => m.SIGNUP_ROUTES),
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/sign-in/login-page.routes').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/search-page.component').then((m) => m.SearchPageComponent),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./features/schedule/schedule-page.component').then((m) => m.SchedulePageComponent),
      },
      {
        path: 'account',
        loadChildren: () => import('./features/account/account-page.routes').then((m) => m.ACCOUNT_ROUTES),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./features/event-details/event-details-page.component').then((m) => m.EventDetailsPageComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
  { path: '**', redirectTo: '' },
];
