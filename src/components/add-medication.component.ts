import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicationService } from '../services/medication.service';
import { GeminiService } from '../services/gemini.service';

@Component({
  selector: 'app-add-medication',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-10 p-6 lg:p-10 font-sans min-h-screen">
      <div class="flex items-center gap-6">
        <button routerLink="/medications" class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-lg active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-white tracking-tight">Initialize Regimen</h1>
          <p class="text-slate-400 text-sm font-bold uppercase tracking-widest">Medication Tracking Protocol</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Form Section -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl p-10 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
            
            <form [formGroup]="medForm" (ngSubmit)="onSubmit()" class="space-y-8 relative z-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Molecular Name</label>
                  <input formControlName="medicationName" type="text" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold" placeholder="e.g. Paracetamol">
                </div>

                <div class="space-y-2">
                   <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Precision Dosage</label>
                   <input formControlName="dosage" type="text" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold" placeholder="e.g. 500mg">
                </div>

                <div class="space-y-2">
                   <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Frequency Cycle</label>
                   <div class="relative">
                     <select formControlName="frequency" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer font-bold">
                       <option value="Daily">Daily Intake</option>
                       <option value="Alternate Days">Alternate Cycles</option>
                       <option value="Weekly">Weekly Sequence</option>
                       <option value="Custom">Custom Algorithm</option>
                     </select>
                     <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-500">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                     </div>
                   </div>
                </div>

                <div class="space-y-2">
                   <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Temporal Window</label>
                   <div class="relative">
                     <select formControlName="timeOfDay" class="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-white outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer font-bold">
                       <option value="Morning">Morning (08:00)</option>
                       <option value="Afternoon">Afternoon (13:00)</option>
                       <option value="Evening">Evening (18:00)</option>
                       <option value="Night">Night (22:00)</option>
                     </select>
                     <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-500">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                     </div>
                   </div>
                </div>
              </div>

              <div class="space-y-2">
                 <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Alert Protocols</label>
                 <div class="grid grid-cols-3 gap-4">
                    <button type="button" (click)="medForm.patchValue({notificationType: 'Push'})" [class]="'py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ' + (medForm.get('notificationType')?.value === 'Push' ? 'bg-brand-500 text-black border-brand-500 shadow-lg shadow-brand-500/20' : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20')">Push</button>
                    <button type="button" (click)="medForm.patchValue({notificationType: 'Email'})" [class]="'py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ' + (medForm.get('notificationType')?.value === 'Email' ? 'bg-brand-500 text-black border-brand-500 shadow-lg shadow-brand-500/20' : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20')">Email</button>
                    <button type="button" (click)="medForm.patchValue({notificationType: 'Both'})" [class]="'py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ' + (medForm.get('notificationType')?.value === 'Both' ? 'bg-brand-500 text-black border-brand-500 shadow-lg shadow-brand-500/20' : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20')">Dual</button>
                 </div>
              </div>

              <button type="submit" [disabled]="medForm.invalid" class="w-full py-6 bg-brand-500 text-black rounded-[2rem] font-black text-lg hover:bg-brand-400 transition-all shadow-2xl shadow-brand-500/40 active:scale-[0.98] disabled:opacity-20 mt-4 leading-none flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Confirm Protocol
              </button>
            </form>
          </div>
        </div>

        <!-- AI Assistant Sidebar -->
        <div class="space-y-6">
           <div class="bg-brand-500 p-8 rounded-[2.5rem] shadow-2xl shadow-brand-500/20 relative overflow-hidden group">
              <div class="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20 blur-3xl"></div>
              <h3 class="text-2xl font-black text-black tracking-tight leading-tight">Neural Scanning Active</h3>
              <p class="text-black/60 text-sm font-bold mt-3 leading-relaxed">Point your camera at a physical prescription to instantly synchronize data points.</p>
              
              <label class="mt-8 cursor-pointer bg-black text-white font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest transition-all hover:bg-slate-900 border border-white/10 flex items-center justify-center gap-3 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/><line x1="21" x2="9" y1="5" y2="17"/><line x1="17" x2="21" y1="9" y2="5"/></svg>
                Initialize Scan
                <input type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)">
              </label>
           </div>

           <div class="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <h4 class="text-white font-black uppercase tracking-widest text-[10px] mb-4 opacity-50">Security Notice</h4>
              <p class="text-slate-500 text-xs font-bold leading-relaxed">
                All medicinal data is encrypted via <span class="text-brand-500">AES-256</span> before persistence. Ensure you are providing accurate dosage information.
              </p>
           </div>
        </div>
      </div>
    </div>

  `,
})
export class AddMedicationComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private medicationService = inject(MedicationService);
  private geminiService = inject(GeminiService);
  private router = inject(Router);

  isAnalyzing = signal(false);
  analysisError = signal<string | null>(null);

  medForm = this.fb.group({
    medicationName: ['', Validators.required],
    dosage: ['', Validators.required],
    frequency: ['Daily', Validators.required],
    timeOfDay: ['Morning'],
    notificationType: ['Push'],
    quantity: [''],
    instructions: [''],
    startDate: [new Date().toISOString().split('T')[0]]
  });


  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.isAnalyzing.set(true);
    this.analysisError.set(null);
    const file = input.files[0];

    try {
      const base64 = await this.fileToBase64(file);
      // Remove data URL prefix for API
      const base64Data = base64.split(',')[1];

      const result = await this.geminiService.extractMedicationDetails(base64Data);

      if (result) {
        this.medForm.patchValue({
          medicationName: result.name || '',
          dosage: result.dosage || '',
          frequency: result.frequency || '',
          quantity: result.quantity || '',
          instructions: result.instructions || ''
        });
      } else {
        this.analysisError.set('Could not identify prescription details.');
      }
    } catch (err) {
      console.error(err);
      this.analysisError.set('Error analyzing image. Please try again.');
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  onSubmit() {
    if (this.medForm.valid) {
      this.medicationService.addMedication(this.medForm.value as any);
      this.router.navigate(['/medications']);
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}