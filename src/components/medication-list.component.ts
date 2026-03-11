import { Component, inject, computed, OnInit } from '@angular/core';
import { MedicationService, Medication } from '../services/medication.service';
import { StoreService } from '../services/store.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-medication-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto space-y-10 p-6 lg:p-10 font-sans min-h-screen">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <h1 class="text-4xl font-black text-white tracking-tight">Prescription Vault</h1>
          <p class="text-slate-400 text-lg ml-1">Archive of all your active and past treatments.</p>
        </div>
        <a routerLink="/add" class="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center text-black hover:bg-brand-400 transition-all shadow-xl shadow-brand-500/20 active:scale-90 group relative">
          <div class="absolute inset-0 bg-brand-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="relative z-10"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </a>
      </div>

      <!-- Active Prescriptions -->
      <div class="space-y-6">
        <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
           <span class="w-2 h-2 rounded-full bg-brand-500"></span>
           Active Regimens
        </h2>
        
        @if (medEntries().active.length === 0) {
          <div class="bg-[#111] rounded-[2.5rem] border border-white/5 p-20 text-center relative overflow-hidden group">
            <div class="absolute inset-0 bg-brand-500/5 blur-[100px] pointer-events-none"></div>
            <p class="text-slate-500 font-black text-xl mb-2 relative z-10">No active prescriptions detected.</p>
            <p class="text-slate-600 text-sm font-bold relative z-10">Use the (+) button to initialize a new tracking sequence.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (med of medEntries().active; track med.id) {
              <div class="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 flex flex-col gap-6 hover:bg-white/5 transition-all group cursor-pointer relative overflow-hidden shadow-2xl">
                <div class="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-500/10 transition-colors"></div>
                
                <div class="flex items-center justify-between relative z-10">
                  <div class="w-16 h-16 rounded-3xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                  </div>
                  <div class="flex flex-col items-end">
                    <span class="text-[10px] font-black text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20 shadow-lg shadow-brand-500/5">Active Now</span>
                  </div>
                </div>

                <div class="relative z-10 space-y-2">
                  <h3 class="font-black text-white text-2xl tracking-tight">{{ med.medicationName }}</h3>
                  <div class="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                    <div class="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-brand-500"><path d="M12 2v20"/><path d="m5 9 7 7 7-7"/></svg>
                       {{ med.dosage }}
                    </div>
                    <div class="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-brand-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                       {{ med.frequency }}
                    </div>
                  </div>
                </div>

                <div class="pt-4 flex items-center justify-between relative z-10">
                   <div class="text-[10px] font-black text-slate-600 uppercase tracking-widest">System sequence ID: #{{ med.id }}</div>
                   <button (click)="deleteMed(med.id)" class="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-500/10">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                   </button>
                </div>
              </div>
            }
          </div>
        }

        <!-- Past Prescriptions -->
        <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.3em] ml-2 pt-10 flex items-center gap-3">
           <span class="w-2 h-2 rounded-full bg-slate-700"></span>
           Deactivated Protocols
        </h2>
        
        @if (medEntries().past.length === 0) {
          <div class="bg-[#111] rounded-[2.5rem] border border-white/5 p-12 text-center opacity-40">
            <p class="text-slate-500 font-bold">No past medications recorded.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 grayscale pb-20">
            @for (med of medEntries().past; track med.id) {
              <div class="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 flex flex-col gap-6 relative overflow-hidden">
                <div class="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                </div>
                <div class="space-y-2">
                  <h3 class="font-black text-slate-400 text-2xl tracking-tight">{{ med.medicationName }}</h3>
                  <p class="text-xs font-black text-slate-600 uppercase tracking-widest">{{ med.dosage }} • {{ med.frequency }}</p>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>

  `
})
export class MedicationListComponent implements OnInit {
  medicationService = inject(MedicationService);
  private store = inject(StoreService);

  medEntries = computed(() => {
    const all = this.medicationService.medications();
    return {
      active: all.filter(m => m.active),
      past: all.filter(m => !m.active)
    };
  });

  ngOnInit() {
    const user = this.store.currentUser();
    if (user) {
      this.medicationService.loadMedications(parseInt(user.id, 10));
    }
  }

  deleteMed(id: string | number | undefined) {
    if (id && confirm('Are you sure you want to remove this medication?')) {
      this.medicationService.deleteMedication(id);
    }
  }
}