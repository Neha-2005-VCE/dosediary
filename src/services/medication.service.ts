import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StoreService } from './store.service';

export interface Medication {
  id?: number;
  userId: number;
  medicationName: string;
  name?: string; // Alias for medicationName
  dosage: string;
  frequency: string;
  timeOfDay?: string;
  notificationType?: string;
  instructions: string;
  adherencePercentage: number;
  active: boolean;
  color?: string;
}

export interface MedicationLog {
  id?: number;
  userId: number;
  schedule: { id: number };
  status: string;
  takenAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private http = inject(HttpClient);
  private store = inject(StoreService);
  private readonly baseUrl = 'http://localhost:8080/api/medications';

  // State
  medications = signal<Medication[]>([]);

  // Derived State
  activeCount = computed(() => this.medications().filter(m => m.active).length);
  recentMeds = computed(() => this.medications().slice(0, 3));

  private getUserId(): number {
    const user = this.store.currentUser();
    if (user && user.id) {
      const parsed = parseInt(user.id, 10);
      return isNaN(parsed) ? 1 : parsed;
    }
    return 1;
  }

  async loadMedications(userId?: number) {
    try {
      const uid = userId ?? this.getUserId();
      const meds = await firstValueFrom(this.http.get<Medication[]>(`${this.baseUrl}/user/${uid}`));
      this.medications.set(meds.map(m => ({ ...m, color: this.getRandomColor() })));
    } catch (err) {
      console.error('Failed to load medications from backend', err);
    }
  }

  async addMedication(med: Partial<Medication>) {
    try {
      const payload = { ...med, userId: this.getUserId(), active: true };
      const newMed = await firstValueFrom(this.http.post<Medication>(`${this.baseUrl}/schedule`, payload));
      this.medications.update(meds => [{ ...newMed, color: this.getRandomColor() }, ...meds]);
    } catch (err) {
      console.error('Failed to add medication', err);
    }
  }

  async deleteMedication(id: string | number) {
    try {
      await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
      this.medications.update(meds => meds.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete medication', err);
    }
  }

  async logDose(userId: number, scheduleId: number, status: 'TAKEN' | 'MISSED' | 'SNOOZED') {
    try {
      const log: MedicationLog = {
        userId,
        schedule: { id: scheduleId },
        status,
        takenAt: new Date().toISOString()
      };
      await firstValueFrom(this.http.post(`${this.baseUrl}/log`, log));
      // Refresh meds to get updated adherence
      await this.loadMedications(userId);
    } catch (err) {
      console.error('Failed to log dose', err);
    }
  }

  private getRandomColor(): string {
    const colors = ['bg-blue-500', 'bg-teal-500', 'bg-indigo-500', 'bg-purple-500', 'bg-rose-500', 'bg-orange-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}