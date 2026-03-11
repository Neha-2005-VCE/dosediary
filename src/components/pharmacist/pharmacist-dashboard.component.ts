import { Component, inject, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { PrescriptionService } from '../../services/prescription.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pharmacist-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-10 p-6 lg:p-10 font-sans min-h-screen">
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-white tracking-tight">Pharmacy Management</h1>
        <p class="text-slate-400 text-lg ml-1">Inventory control and pharmaceutical logistics.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
           <div class="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-500/10 transition-colors"></div>
           <span class="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Active Prescriptions</span>
           <p class="text-5xl font-black text-white mt-4">{{ activePrescriptions().length }}</p>
           <div class="mt-4 flex items-center gap-2 text-brand-500 text-xs font-bold">
             <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
             In System
           </div>
        </div>
        <div class="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
           <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
           <span class="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Total Prescriptions</span>
           <p class="text-5xl font-black text-white mt-4">{{ rxService.prescriptions().length }}</p>
           <div class="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest">All Records</div>
        </div>
        <div class="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
           <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
           <span class="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Expiring Soon</span>
           <p class="text-5xl font-black text-white mt-4">{{ expiringSoon().length }}</p>
           <div class="mt-4 flex items-center gap-2 text-red-500 text-xs font-bold">
             <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
             Within 30 Days
           </div>
        </div>
      </div>

      <!-- Prescriptions Table -->
      <div class="bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div class="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h2 class="text-xl font-black text-white tracking-tight flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-500"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
             Prescription Directory
          </h2>
        </div>

        <div class="overflow-x-auto p-4 pt-0">
          <table class="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                <th class="p-6">Patient</th>
                <th class="p-6">Medication</th>
                <th class="p-6">Dosage</th>
                <th class="p-6">Doctor</th>
                <th class="p-6">Status</th>
                <th class="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (rx of rxService.prescriptions(); track rx.id) {
                <tr class="bg-black/40 hover:bg-white/5 transition-all group rounded-2xl">
                  <td class="p-6 font-black text-white rounded-l-2xl">
                    <div class="flex items-center gap-3">
                       <div class="w-10 h-10 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-xl flex items-center justify-center text-xs font-black uppercase">
                         {{ (rx.patientName || 'P').substring(0,2) }}
                       </div>
                       {{ rx.patientName || 'Patient #' + rx.userId }}
                    </div>
                  </td>
                  <td class="p-6 text-slate-300 font-medium">{{ rx.medicationName }}</td>
                  <td class="p-6 text-slate-400 text-sm font-bold">{{ rx.dosage }}</td>
                  <td class="p-6 text-slate-400 text-sm font-bold">{{ rx.doctorName }}</td>
                  <td class="p-6">
                    <span [class]="'inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ' + (rx.status === 'ACTIVE' ? 'bg-brand-500/10 text-brand-500 border-brand-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20')">
                      <span [class]="'w-1.5 h-1.5 rounded-full ' + (rx.status === 'ACTIVE' ? 'bg-brand-500' : 'bg-slate-500')"></span>
                      {{ rx.status }}
                    </span>
                  </td>
                  <td class="p-6 text-right rounded-r-2xl">
                    <button (click)="verifyPrescription(rx)" class="px-5 py-2 bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-500 hover:text-black transition-all active:scale-[0.95]">
                      Verify
                    </button>
                  </td>
                </tr>
              }
              @if (rxService.prescriptions().length === 0) {
                <tr><td colspan="6" class="text-center py-16 text-slate-600 font-bold italic">No prescriptions in the system yet.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PharmacistDashboardComponent implements OnInit {
  store = inject(StoreService);
  rxService = inject(PrescriptionService);

  activePrescriptions = () => this.rxService.prescriptions().filter(rx => rx.status === 'ACTIVE');
  expiringSoon = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.rxService.prescriptions().filter(rx => {
      if (!rx.expiryDate) return false;
      const expiry = new Date(rx.expiryDate);
      return expiry <= thirtyDaysFromNow && rx.status === 'ACTIVE';
    });
  };

  ngOnInit() {
    // Pharmacist sees all prescriptions
    this.rxService.loadAllPrescriptions();
  }

  async verifyPrescription(rx: any) {
    try {
      await this.rxService.updatePrescription(rx.id, { status: 'VERIFIED' });
    } catch (e) {
      console.error('Failed to verify prescription', e);
      alert('Failed to verify prescription. Please try again.');
    }
  }
}