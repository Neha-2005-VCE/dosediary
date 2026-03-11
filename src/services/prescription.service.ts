import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Prescription } from '../models/types';

@Injectable({
    providedIn: 'root'
})
export class PrescriptionService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8080/api/prescriptions';

    prescriptions = signal<Prescription[]>([]);

    async loadPrescriptions(userId: number) {
        try {
            const data = await firstValueFrom(this.http.get<Prescription[]>(`${this.baseUrl}/user/${userId}`));
            this.prescriptions.set(data);
        } catch (err) {
            console.error('Failed to load prescriptions', err);
        }
    }

    async loadDoctorPrescriptions(doctorId: number) {
        try {
            const data = await firstValueFrom(this.http.get<Prescription[]>(`${this.baseUrl}/doctor/${doctorId}`));
            this.prescriptions.set(data);
        } catch (err) {
            console.error('Failed to load doctor prescriptions', err);
        }
    }

    async loadAllPrescriptions() {
        try {
            const data = await firstValueFrom(this.http.get<Prescription[]>(`${this.baseUrl}/all`));
            this.prescriptions.set(data);
        } catch (err) {
            console.error('Failed to load all prescriptions', err);
        }
    }

    async issuePrescription(prescription: Partial<Prescription>): Promise<Prescription | null> {
        try {
            const saved = await firstValueFrom(
                this.http.post<Prescription>(`${this.baseUrl}/issue`, prescription)
            );
            this.prescriptions.update(list => [saved, ...list]);
            return saved;
        } catch (err) {
            console.error('Failed to issue prescription', err);
            return null;
        }
    }

    async updatePrescription(id: string | number, updates: Partial<Prescription>): Promise<Prescription | null> {
        try {
            const updated = await firstValueFrom(
                this.http.put<Prescription>(`${this.baseUrl}/${id}`, updates)
            );
            this.prescriptions.update(list => list.map(p => (p.id?.toString() === id.toString()) ? updated : p));
            return updated;
        } catch (err) {
            console.error('Failed to update prescription', err);
            return null;
        }
    }

    async renewPrescription(id: string | number) {
        try {
            const updated = await firstValueFrom(this.http.put<Prescription>(`${this.baseUrl}/${id}/renew`, {}));
            this.prescriptions.update(list => list.map(p => (p.id?.toString() === id.toString()) ? updated : p));
        } catch (err) {
            console.error('Failed to renew prescription', err);
        }
    }
}
