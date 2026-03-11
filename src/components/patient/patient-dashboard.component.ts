import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { MedicationService } from '../../services/medication.service';
import { PrescriptionService } from '../../services/prescription.service';
import { StoreService } from '../../services/store.service';
import { RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-10 p-6 lg:p-10 font-sans min-h-screen">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="space-y-2">
          <h1 class="text-4xl font-black text-white tracking-tight">
            Hello, <span class="text-brand-500">{{ store.currentUser()?.fullName }}</span>
          </h1>
          <p class="text-slate-400 text-lg ml-1">Your precision health snapshot for today.</p>
        </div>
        <div class="hidden md:block">
           <span class="inline-flex items-center gap-3 bg-brand-500/10 text-brand-500 px-6 py-3 rounded-2xl text-sm font-black border border-brand-500/20 shadow-lg shadow-brand-500/5 uppercase tracking-widest">
             <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
             Subject: Patient
           </span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-500/10 transition-colors"></div>
          <span class="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Active Meds</span>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-5xl font-black text-white">{{ medicationService.activeCount() }}</span>
          </div>
        </div>

        <div class="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
          <span class="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Prescriptions</span>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-5xl font-black text-white">{{ prescriptionService.prescriptions().length }}</span>
          </div>
        </div>

        <div class="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
          <span class="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Adherence</span>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-5xl font-black" [class.text-brand-500]="avgAdherence() > 80" [class.text-orange-500]="avgAdherence() <= 80">{{ avgAdherence() }}%</span>
          </div>
        </div>
        
        <div class="bg-brand-500 p-8 rounded-3xl shadow-xl shadow-brand-500/10 flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:bg-brand-400 transition-all active:scale-[0.98]" routerLink="/assistant">
           <div class="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20 blur-2xl"></div>
           <div>
             <span class="text-black/60 font-bold text-xs uppercase tracking-[0.2em]">AI Intelligence</span>
             <h3 class="text-2xl font-black text-black mt-2 flex items-center gap-2">Ask AROMI <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></h3>
           </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Reminders Section -->
        <div class="bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <div class="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
            <div class="flex items-center gap-4">
               <div class="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
               </div>
               <div>
                 <h2 class="text-xl font-black text-white tracking-tight">Active Reminders</h2>
                 <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time tracking</p>
               </div>
            </div>
          </div>
          
          <div class="p-8 space-y-4 flex-1">
            @if (medicationService.medications().length === 0) {
              <div class="h-40 flex flex-col items-center justify-center text-slate-600 italic">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <p>No active medication alerts.</p>
              </div>
            } @else {
              <div class="space-y-4">
                @for (med of medicationService.medications(); track med.id) {
                  <div class="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
                    <div class="flex items-center gap-5">
                      <div [class]="'w-1.5 h-12 rounded-full shadow-lg ' + (med.color || 'bg-brand-500')"></div>
                      <div>
                        <h3 class="font-bold text-white text-lg tracking-tight">{{ med.medicationName }}</h3>
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{{ med.dosage }} • {{ med.timeOfDay || 'Scheduled' }}</p>
                      </div>
                    </div>
                    <div class="flex gap-3">
                      <button (click)="markTaken(med)" class="px-5 py-2.5 bg-brand-500 text-black text-xs font-black rounded-xl hover:bg-brand-400 transition-all active:scale-[0.95] shadow-lg shadow-brand-500/10">Take Now</button>
                      <button (click)="snooze(med)" class="p-2.5 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326a1 1 0 0 0 .738 1.674h16a1 1 0 0 0 .738-1.674l-2.152-2.315a6 6 0 0 1-1.586-4.111V7a6 6 0 1 0-12 0v1.226a6 6 0 0 1-1.586 4.111z"/></svg>
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Official Prescriptions Section -->
        <div class="bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <div class="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
            <div class="flex items-center gap-4">
               <div class="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
               </div>
               <div>
                 <h2 class="text-xl font-black text-white tracking-tight">Prescription Vault</h2>
                 <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Verified Medical Records</p>
               </div>
            </div>
          </div>
          
          <div class="p-8 space-y-4 flex-1">
            @if (prescriptionService.prescriptions().length === 0) {
              <div class="h-40 flex flex-col items-center justify-center text-slate-600 italic">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <p>No verified prescriptions found.</p>
              </div>
            } @else {
              <div class="space-y-4">
                @for (rx of prescriptionService.prescriptions(); track rx.id) {
                  <div class="p-6 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div class="space-y-3">
                        <div class="flex items-center gap-3">
                          <h3 class="font-black text-white text-xl tracking-tight leading-none">{{ rx.medicationName }}</h3>
                          <span [class]="'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ' + (rx.status === 'ACTIVE' ? 'bg-brand-500/10 text-brand-500 border-brand-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20')">
                            {{ rx.status }}
                          </span>
                        </div>
                        <p class="text-sm font-bold text-slate-400 uppercase tracking-tighter">{{ rx.dosage }} • {{ rx.duration }}</p>
                        <div class="flex items-center gap-4 mt-2">
                           <div class="flex items-center gap-2 text-xs font-bold text-slate-500">
                             <div class="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-[10px] border border-white/10 uppercase">Dr</div>
                             {{ rx.doctorName }}
                           </div>
                           <div class="text-xs font-bold text-slate-600 flex items-center gap-1">
                             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                             Exp: {{ rx.expiryDate | date:'MMM yyyy' }}
                           </div>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3">
                        <button (click)="prescriptionService.renewPrescription(rx.id!)" class="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all active:scale-[0.95]">
                          Renew
                        </button>
                        <button (click)="downloadPdf(rx)" class="p-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:text-white transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class PatientDashboardComponent implements OnInit {
  medicationService = inject(MedicationService);
  prescriptionService = inject(PrescriptionService);
  store = inject(StoreService);

  avgAdherence = computed(() => {
    const meds = this.medicationService.medications();
    if (meds.length === 0) return 0;
    const sum = meds.reduce((acc, current) => acc + (current.adherencePercentage || 0), 0);
    return Math.round(sum / meds.length);
  });

  ngOnInit() {
    const user = this.store.currentUser();
    if (user) {
      const userId = parseInt(user.id, 10) || 1;
      this.medicationService.loadMedications(userId);
      this.prescriptionService.loadPrescriptions(userId);
    }
  }

  markTaken(med: any) {
    const user = this.store.currentUser();
    if (!user || !med.id) return;
    const userId = parseInt(user.id, 10) || 1;
    this.medicationService.logDose(userId, med.id, 'TAKEN');
  }

  snooze(med: any) {
    const user = this.store.currentUser();
    if (!user || !med.id) return;
    const userId = parseInt(user.id, 10) || 1;
    this.medicationService.logDose(userId, med.id, 'SNOOZED');
  }

  downloadPdf(rx: any) {
    alert(`Downloading Prescription PDF for ${rx.medicationName}...\n\nDoctor: ${rx.doctorName}\nInstructions: ${rx.instructions}`);
  }
}