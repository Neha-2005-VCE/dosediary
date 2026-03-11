import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { User, Prescription, UserRole } from '../models/types';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly CURRENT_USER_KEY = 'dd_current_user';
  private readonly AUTH_URL = 'http://localhost:8080/api/v1/auth';
  private readonly USERS_URL = 'http://localhost:8080/api/users';

  private http = inject(HttpClient);
  private router = inject(Router);

  // State
  currentUser = signal<User | null>(this.loadCurrentUser());
  users = signal<User[]>([]);

  // Computed Roles
  isLoggedIn = computed(() => !!this.currentUser());
  isDoctor = computed(() => this.currentUser()?.role === 'DOCTOR');
  isPatient = computed(() => this.currentUser()?.role === 'PATIENT');
  isPharmacist = computed(() => this.currentUser()?.role === 'PHARMACIST');
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  // Helper to get patients for doctors to select
  allPatients = computed(() => this.users().filter(u => u.role === 'PATIENT'));

  constructor() {
    // Persist current user to localStorage
    effect(() => {
      if (this.currentUser()) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(this.currentUser()));
      } else {
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    });

    // Load users from backend if logged in
    if (this.currentUser()) {
      this.loadUsers();
    }
  }

  // --- Data Loading ---

  async loadUsers() {
    try {
      const users = await firstValueFrom(this.http.get<User[]>(`${this.USERS_URL}`));
      this.users.set(users);
    } catch (err) {
      console.error('Failed to load users from backend', err);
    }
  }

  async loadPatients() {
    try {
      const patients = await firstValueFrom(this.http.get<User[]>(`${this.USERS_URL}/patients`));
      // Merge patients into users list
      this.users.update(current => {
        const nonPatients = current.filter(u => u.role !== 'PATIENT');
        return [...nonPatients, ...patients];
      });
    } catch (err) {
      console.error('Failed to load patients from backend', err);
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
        // Load users after login (delay to let token persist to localStorage first)
        setTimeout(() => this.loadUsers(), 200);
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
        // Load users after registration
        setTimeout(() => this.loadUsers(), 200);
      }
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  }

  logout() {
    this.currentUser.set(null);
    this.users.set([]);
    this.router.navigate(['/auth']);
  }

  // --- Private Helpers ---

  private loadCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
}