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
    path: 'forgot-password',
    loadChildren: () => import('./features/auth/forgot-password/forgot-password.routes').then((m) => m.LOGIN_ROUTES),
  },

  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home-page.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'search',
        loadChildren: () => import('./features/search/search-page.routes').then((m) => m.SEARCH_ROUTES),
      },
      {
        path: 'create',
        loadChildren: () => import('./features/create-event/create-event-page.routes').then((m)=> m.CREATE_EVENT_ROUTES)
      },
      {
        path: 'schedule',
        loadChildren: () => import('./features/schedule/schedule-page.routes').then((m) => m.SCHEDULE_ROUTES),
      },
      {
        path: 'account',
        loadChildren: () => import('./features/account/account-page.routes').then((m) => m.ACCOUNT_ROUTES),
      },
      {
        path: 'events/:id',
        loadChildren: () =>
          import('./features/event-details/event-details-page.routes').then((m) => m.EVENT_DETAILS_ROUTES),
      },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
  { path: '**', redirectTo: '' },
];
