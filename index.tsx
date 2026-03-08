
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './src/app.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, Routes, CanActivateFn, Router } from '@angular/router';
import { DashboardComponent } from './src/components/dashboard.component';
import { MedicationListComponent } from './src/components/medication-list.component';
import { AddMedicationComponent } from './src/components/add-medication.component';
import { ChatComponent } from './src/components/chat.component';
import { AuthComponent } from './src/components/auth/auth.component';
import { ProjectStatusComponent } from './src/components/project-status.component';
import { inject } from '@angular/core';
import { StoreService } from './src/services/store.service';

import { provideHttpClient, withInterceptors, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const store = inject(StoreService);
  const token = store.currentUser()?.token;
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }
  return next(req);
};

const authGuard: CanActivateFn = (route, state) => {
  const store = inject(StoreService);
  const router = inject(Router);

  if (store.isLoggedIn()) {
    return true;
  } else {
    return router.parseUrl('/auth');
  }
};

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'medications', component: MedicationListComponent, canActivate: [authGuard] },
  { path: 'add', component: AddMedicationComponent, canActivate: [authGuard] },
  { path: 'assistant', component: ChatComponent, canActivate: [authGuard] },
  { path: 'status', component: ProjectStatusComponent, canActivate: [authGuard] },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(err => console.error(err));


// AI Studio always uses an `index.tsx` file for all project types.