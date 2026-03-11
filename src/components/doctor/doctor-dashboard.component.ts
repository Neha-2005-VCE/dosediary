import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { PrescriptionService } from '../../services/prescription.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Prescription } from '../../models/types';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, TitleCasePipe],
  template: `
    <div class="max-w-7xl mx-auto space-y-10 p-6 lg:p-10 font-sans min-h-screen">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center text-brand-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>
            </div>
            <h1 class="text-4xl font-black text-white tracking-tight">Doctor's Console</h1>
          </div>
          <p class="text-slate-400 text-lg ml-1">Precision care management and prescription control.</p>
        </div>
        <div class="flex items-center gap-4">
          <label class="cursor-pointer bg-[#111] text-white px-6 py-4 rounded-2xl font-black border border-white/10 shadow-xl hover:bg-white/5 transition-all active:scale-[0.98] flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            Scan Prescription
            <input type="file" accept="image/*" class="hidden" (change)="onScanSelected($event)">
          </label>
          <button (click)="openIssueMode()" class="bg-brand-500 text-black px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-400 transition-all active:scale-[0.98] flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Issue Prescription
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
           <div class="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-500/10 transition-colors"></div>
           <span class="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Patients</span>
           <p class="text-5xl font-black text-white mt-4">{{ store.allPatients().length }}</p>
           <div class="mt-4 flex items-center gap-2 text-brand-500 text-xs font-bold">
             <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
             Currently Managed
           </div>
        </div>
        <div class="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
           <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
           <span class="text-slate-500 text-xs font-bold uppercase tracking-widest">Prescriptions Issued</span>
           <p class="text-5xl font-black text-white mt-4">{{ rxService.prescriptions().length }}</p>
           <div class="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Total Lifecycle</div>
        </div>
        <div class="bg-brand-500 p-8 rounded-3xl shadow-xl shadow-brand-500/10 flex flex-col justify-between overflow-hidden relative group">
           <div class="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20 blur-2xl"></div>
           <span class="text-black/60 text-xs font-bold uppercase tracking-widest">System Status</span>
           <div>
             <p class="text-2xl font-black text-black">License Verified</p>
             <p class="text-black/80 font-bold mt-1 text-sm tracking-tight">Active for Prescribing</p>
           </div>
        </div>
      </div>

      <!-- Main Activity Area -->
      <div class="bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[500px]">
        <!-- Modern Tabs -->
        <div class="bg-black/40 flex p-3 m-6 rounded-2xl gap-2 w-fit">
           <button (click)="view.set('list')" [class]="'px-8 py-3 text-sm font-black rounded-xl transition-all ' + (view() === 'list' ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/20' : 'text-slate-500 hover:text-white')">Prescription Vault</button>
           <button (click)="view.set('form')" [class]="'px-8 py-3 text-sm font-black rounded-xl transition-all ' + (view() === 'form' ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/20' : 'text-slate-500 hover:text-white')">
             {{ editModeId() ? 'Update Order' : 'Prepare Order' }}
           </button>
        </div>

        <div class="p-8 pt-0">
          @if (view() === 'list') {
             <div class="overflow-x-auto custom-scrollbar">
               <table class="w-full text-left border-separate border-spacing-y-4">
                 <thead>
                   <tr class="text-slate-500 text-xs font-black uppercase tracking-[0.2em] px-4">
                     <th class="pb-2 pl-6">Patient Entity</th>
                     <th class="pb-2">Medication</th>
                     <th class="pb-2">Dosage</th>
                     <th class="pb-2 text-center">Security Status</th>
                     <th class="pb-2">Expiry</th>
                     <th class="pb-2 text-right pr-6">Management</th>
                   </tr>
                 </thead>
                 <tbody>
                   @for (rx of rxService.prescriptions(); track rx.id) {
                     <tr class="bg-black/40 hover:bg-white/5 transition-all group rounded-2xl">
                       <td class="py-6 pl-6 rounded-l-2xl">
                         <div class="flex items-center gap-3">
                           <div class="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 font-bold text-sm">
                             {{ (rx.patientName || 'P').substring(0,1) }}
                           </div>
                           <span class="text-white font-bold">{{ rx.patientName || 'Patient #' + rx.userId }}</span>
                         </div>
                       </td>
                       <td class="py-6 text-slate-300 font-medium">{{ rx.medicationName }}</td>
                       <td class="py-6">
                         <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-sm font-bold">{{ rx.dosage }}</span>
                       </td>
                       <td class="py-6 text-center">
                         <span [class]="'px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ' + (rx.status === 'ACTIVE' ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20')">
                           {{ rx.status }}
                         </span>
                       </td>
                       <td class="py-6 text-slate-500 font-bold text-sm italic">{{ rx.expiryDate }}</td>
                       <td class="py-6 text-right pr-6 rounded-r-2xl">
                         <button (click)="editPrescription(rx)" class="bg-white/5 hover:bg-brand-500 hover:text-black border border-white/10 text-white px-5 py-2 rounded-xl text-xs font-heavy transition-all active:scale-[0.95]">
                           Review & Renew
                         </button>
                       </td>
                     </tr>
                   }
                   @if (rxService.prescriptions().length === 0) {
                     <tr><td colspan="6" class="text-center py-24 text-slate-600 font-bold italic tracking-wide">No secure prescription records found in the vault.</td></tr>
                   }
                 </tbody>
               </table>
             </div>
          }

          @if (view() === 'form') {
            <form [formGroup]="rxForm" (ngSubmit)="onSubmit()" class="max-w-4xl mx-auto py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              @if (editModeId()) {
                <div class="bg-brand-500/10 border border-brand-500/20 rounded-3xl p-6 flex items-center gap-6">
                  <div class="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-black shadow-xl shadow-brand-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <div>
                    <h3 class="text-white font-black text-xl tracking-tight">Updating Active Protocol</h3>
                    <p class="text-slate-400 mt-1">Every modification is logged for pharmaceutical verification.</p>
                  </div>
                </div>
              }

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Patient Subject</label>
                  <div class="relative">
                    <select formControlName="patientId" [attr.disabled]="editModeId() ? true : null" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none cursor-pointer disabled:opacity-40">
                      <option value="" disabled>Search patient directory...</option>
                      @for (p of store.allPatients(); track p.id) {
                        <option [value]="p.id">{{ p.fullName }}</option>
                      }
                    </select>
                    <div class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Status</label>
                  <div class="relative">
                    <select formControlName="status" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none cursor-pointer">
                      <option value="ACTIVE">Operational: Active</option>
                      <option value="COMPLETED">Operational: Completed</option>
                      <option value="CANCELLED">Operational: Revoked</option>
                    </select>
                    <div class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Medication Identity</label>
                  <input formControlName="medicationName" type="text" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/50" placeholder="e.g. Amoxicillin Trihydrate">
                </div>
                <div class="space-y-3">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Precise Dosage</label>
                  <input formControlName="dosage" type="text" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/50" placeholder="e.g. 500mg Unit Base">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                   <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Cycle Frequency</label>
                   <input formControlName="frequency" type="text" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/50" placeholder="e.g. BID (Twice Daily)">
                </div>
                <div class="space-y-3">
                   <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Protocol Duration</label>
                   <input formControlName="duration" type="text" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/50" placeholder="e.g. 14 Continuous Days">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div class="space-y-3">
                   <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Expiration Deadline</label>
                   <input formControlName="expiryDate" type="date" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-500/50">
                </div>
              </div>

              <div class="space-y-3">
                 <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Clinical Instructions</label>
                 <textarea formControlName="instructions" rows="4" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/50 resize-none" placeholder="Detailed administration protocols and patient guidance..."></textarea>
              </div>

              <div class="flex justify-end gap-4 pt-10">
                <button type="button" (click)="view.set('list')" class="px-10 py-4 rounded-2xl text-slate-500 font-black uppercase tracking-widest hover:text-white transition-all">Abort</button>
                <button type="submit" [disabled]="rxForm.invalid" class="px-12 py-4 rounded-2xl bg-brand-500 text-black font-black shadow-xl shadow-brand-500/20 hover:bg-brand-400 transition-all active:scale-[0.98] disabled:opacity-40">
                  {{ editModeId() ? 'Authorize Update' : 'Authorize Issue' }}
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `
})
export class DoctorDashboardComponent implements OnInit {
  store = inject(StoreService);
  rxService = inject(PrescriptionService);
  fb: FormBuilder = inject(FormBuilder);
  geminiService = inject(GeminiService);

  view = signal<'list' | 'form'>('list');
  editModeId = signal<string | null>(null);

  rxForm = this.fb.group({
    patientId: ['', Validators.required],
    medicationName: ['', Validators.required],
    dosage: ['', Validators.required],
    frequency: ['', Validators.required],
    duration: ['', Validators.required],
    instructions: ['', Validators.required],
    status: ['ACTIVE'],
    expiryDate: [new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]
  });

  ngOnInit() {
    const user = this.store.currentUser();
    if (user) {
      const doctorId = parseInt(user.id, 10);
      if (!isNaN(doctorId)) {
        this.rxService.loadDoctorPrescriptions(doctorId);
      }
      // Load patients for the dropdown
      this.store.loadPatients();
    }
  }

  openIssueMode() {
    this.editModeId.set(null);
    this.rxForm.reset({
      status: 'ACTIVE',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    this.view.set('form');
  }

  async onScanSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    alert(`Extracting data from ${file.name} using AI...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const extracted = await this.geminiService.extractMedicationDetails(base64String);
          this.editModeId.set(null);
          if (extracted) {
            this.rxForm.patchValue({
              medicationName: extracted.name || 'Extracted Medication',
              dosage: extracted.dosage || '',
              frequency: extracted.frequency || '',
              duration: '30 Days',
              instructions: extracted.instructions || '',
              status: 'ACTIVE',
              expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
            alert('AI Extraction successful!');
          } else {
            alert('AI could not extract details properly.');
          }
          this.view.set('form');
        } catch (e) {
          console.error('Extraction failed', e);
          alert('AI Extraction failed. Check API key or console.');
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error('File read error', e);
    }
  }

  editPrescription(rx: any) {
    this.editModeId.set(String(rx.id));
    this.rxForm.patchValue({
      patientId: String(rx.userId || rx.patientId),
      medicationName: rx.medicationName,
      dosage: rx.dosage,
      frequency: rx.frequency,
      duration: rx.duration,
      instructions: rx.instructions,
      status: rx.status,
      expiryDate: rx.expiryDate ? String(rx.expiryDate).split('T')[0] : ''
    });
    this.view.set('form');
  }

  async onSubmit() {
    if (this.rxForm.valid) {
      const formVal = this.rxForm.value;
      const doctor = this.store.currentUser();
      const patient = this.store.allPatients().find(p => p.id === formVal.patientId);

      if (this.editModeId()) {
        // Update existing via backend
        await this.rxService.updatePrescription(this.editModeId()!, {
          medicationName: formVal.medicationName!,
          dosage: formVal.dosage!,
          frequency: formVal.frequency!,
          duration: formVal.duration!,
          instructions: formVal.instructions!,
          expiryDate: formVal.expiryDate!,
          status: formVal.status as any
        });
        alert('Prescription updated successfully.');
      } else {
        // Create new via backend
        await this.rxService.issuePrescription({
          userId: Number(formVal.patientId),
          doctorId: Number(doctor?.id),
          patientName: patient?.fullName || 'Unknown',
          doctorName: doctor?.fullName || 'Unknown',
          medicationName: formVal.medicationName!,
          dosage: formVal.dosage!,
          frequency: formVal.frequency!,
          duration: formVal.duration!,
          instructions: formVal.instructions!,
          expiryDate: formVal.expiryDate!,
          status: 'ACTIVE'
        } as any);
        alert('Prescription issued successfully.');
      }

      this.view.set('list');
    }
  }
}