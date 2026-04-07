// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sections/hero/hero').then(m => m.HeroComponent),
    title: 'ITWise — Future-Ready IT Consultancy'
  },
  {
    path: 'services',
    loadComponent: () => import('./sections/services/services').then(m => m.ServicesComponent),
    title: 'Services — ITWise'
  },
  {
    path: 'about',
    loadComponent: () => import('./sections/about/about').then(m => m.AboutComponent),
    title: 'About — ITWise'
  },
  {
    path: 'team',
    loadComponent: () => import('./sections/team/team').then(m => m.TeamComponent),
    title: 'Team — ITWise'
  },
  {
    path: 'contact',
    loadComponent: () => import('./sections/contact/contact').then(m => m.ContactComponent),
    title: 'Contact — ITWise'
  },
  // Fallback: redirect unknown routes to home
  { path: '**', redirectTo: '' }
];