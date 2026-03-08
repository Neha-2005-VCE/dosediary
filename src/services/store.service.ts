import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { User, Prescription, UserRole, PrescriptionVersion } from '../models/types';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly USERS_KEY = 'dd_users';
  private readonly PRESCRIPTIONS_KEY = 'dd_prescriptions';
  private readonly CURRENT_USER_KEY = 'dd_current_user';
  private readonly AUTH_URL = 'http://localhost:8080/api/v1/auth';

  private http = inject(HttpClient);
  private router = inject(Router);

  // State
  currentUser = signal<User | null>(this.loadCurrentUser());
  users = signal<User[]>(this.loadFromStorage(this.USERS_KEY) || []);
  prescriptions = signal<Prescription[]>(this.loadFromStorage(this.PRESCRIPTIONS_KEY) || []);

  // Computed Roles
  isLoggedIn = computed(() => !!this.currentUser());
  isDoctor = computed(() => this.currentUser()?.role === 'DOCTOR');
  isPatient = computed(() => this.currentUser()?.role === 'PATIENT');
  isPharmacist = computed(() => this.currentUser()?.role === 'PHARMACIST');
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  // Helper to get patients for doctors to select
  allPatients = computed(() => this.users().filter(u => u.role === 'PATIENT'));

  constructor() {
    // Effects to persist state
    effect(() => {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users()));
    });
    effect(() => {
      localStorage.setItem(this.PRESCRIPTIONS_KEY, JSON.stringify(this.prescriptions()));
    });
    effect(() => {
      if (this.currentUser()) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(this.currentUser()));
      } else {
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    });

    if (this.users().length === 0) {
      this.seedData();
    }
  }

  // --- Auth Methods ---

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.AUTH_URL}/authenticate`, { email, password })
      );
      if (response && response.token) {
        const user: User = {
          id: response.id ? String(response.id) : crypto.randomUUID(),
          fullName: response.fullName,
          email: response.email,
          role: response.role as UserRole,
          token: response.token
        };
        this.currentUser.set(user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  }

  async register(userData: any) {
    try {
      const payload = {
        fullName: userData.fullName || userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role.toUpperCase(),
        medicalLicenseNumber: userData.medicalLicenseNumber,
        specialization: userData.specialization,
        medicalHistory: userData.medicalHistory,
        pharmacyName: userData.pharmacyName,
        shopDetails: userData.shopDetails
      };

      const response = await firstValueFrom(
        this.http.post<any>(`${this.AUTH_URL}/register`, payload)
      );

      if (response && response.token) {
        const user: User = {
          id: response.id ? String(response.id) : crypto.randomUUID(),
          fullName: response.fullName,
          email: response.email,
          role: response.role as UserRole,
          token: response.token
        };
        this.currentUser.set(user);
      }
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  }

  logout() {
    this.currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  // --- Prescription Methods ---

  issuePrescription(prescription: Omit<Prescription, 'id' | 'issuedDate' | 'status' | 'doctorName' | 'doctorId' | 'history'>) {
    const doctor = this.currentUser();
    if (!doctor || doctor.role !== 'DOCTOR') return;

    const newRx: Prescription = {
      ...prescription,
      id: crypto.randomUUID(),
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      issuedDate: new Date().toISOString(),
      status: 'active',
      history: []
    };

    this.prescriptions.update(rx => [newRx, ...rx]);
  }

  updatePrescription(id: string, updates: Partial<Prescription>, reason: string) {
    const doctor = this.currentUser();
    if (!doctor || doctor.role !== 'DOCTOR') return;

    this.prescriptions.update(items => items.map(p => {
      if (p.id === id) {
        // Create audit record
        const version: PrescriptionVersion = {
          updatedAt: new Date().toISOString(),
          updatedBy: doctor.fullName,
          reason: reason,
          previousContent: { ...p } // Snapshot of previous state
        };

        return {
          ...p,
          ...updates,
          history: [version, ...p.history]
        };
      }
      return p;
    }));
  }

  getMyPrescriptions() {
    const user = this.currentUser();
    if (!user) return [];

    if (user.role === 'PATIENT') {
      return this.prescriptions().filter(p => p.patientId === user.id);
    } else if (user.role === 'DOCTOR') {
      return this.prescriptions().filter(p => p.doctorId === user.id);
    }
    return [];
  }

  // --- Private Helpers ---

  private loadFromStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private loadCurrentUser(): User | null {
    return this.loadFromStorage(this.CURRENT_USER_KEY);
  }

  private seedData() {
    const patient: User = {
      id: 'p1', fullName: 'John Doe', email: 'patient@demo.com', password: 'pass', role: 'PATIENT', medicalHistory: 'Hypertension'
    };
    const doctor: User = {
      id: 'd1', fullName: 'Dr. Smith', email: 'doctor@demo.com', password: 'pass', role: 'DOCTOR', specialization: 'Cardiology', medicalLicenseNumber: 'LIC-12345'
    };
    const pharmacist: User = {
      id: 'ph1', fullName: 'Pharma Joe', email: 'pharmacy@demo.com', password: 'pass', role: 'PHARMACIST', pharmacyName: 'City Health Pharmacy'
    };
    const admin: User = {
      id: 'a1', fullName: 'Admin User', email: 'admin@demo.com', password: 'pass', role: 'ADMIN'
    };
    this.users.set([patient, doctor, pharmacist, admin]);
  }
}