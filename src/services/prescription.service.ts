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

    async renewPrescription(id: string) {
        try {
            const updated = await firstValueFrom(this.http.put<Prescription>(`${this.baseUrl}/${id}/renew`, {}));
            this.prescriptions.update(list => list.map(p => p.id === id ? updated : p));
        } catch (err) {
            console.error('Failed to renew prescription', err);
        }
    }
}
