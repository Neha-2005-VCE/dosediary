import { Component, inject } from '@angular/core';
import { StoreService } from '../services/store.service';
import { DoctorDashboardComponent } from './doctor/doctor-dashboard.component';
import { PatientDashboardComponent } from './patient/patient-dashboard.component';
import { PharmacistDashboardComponent } from './pharmacist/pharmacist-dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DoctorDashboardComponent, 
    PatientDashboardComponent, 
    PharmacistDashboardComponent, 
    AdminDashboardComponent
  ],
  template: `
    @if (store.isDoctor()) {
      <app-doctor-dashboard></app-doctor-dashboard>
    } @else if (store.isPatient()) {
      <app-patient-dashboard></app-patient-dashboard>
    } @else if (store.isPharmacist()) {
      <app-pharmacist-dashboard></app-pharmacist-dashboard>
    } @else if (store.isAdmin()) {
      <app-admin-dashboard></app-admin-dashboard>
    }
  `
})
export class DashboardComponent {
  store = inject(StoreService);
}