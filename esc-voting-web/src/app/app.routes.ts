import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.Register),
  },
  {
    path: 'my-tops',
    loadComponent: () =>
      import('./pages/my-tops/my-tops').then(m => m.MyTops),
  },
  {
    path: 'groups',
    loadComponent: () =>
      import('./pages/groups/groups').then(m => m.Groups),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile').then(m => m.Profile),
  },
  {
    path: 'mentions-legales',
    loadComponent: () =>
      import('./pages/mentions-legales/mentions-legales').then(m => m.MentionsLegalesComponent),
  },
  {
    path: 'politique-confidentialite',
    loadComponent: () =>
      import('./pages/politique-confidentialite/politique-confidentialite').then(m => m.PolitiqueConfidentialiteComponent),
  },
  {
    path: 'cgu',
    loadComponent: () =>
      import('./pages/cgu/cgu').then(m => m.CguComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then(m => m.NotFoundComponent),
  },
];
