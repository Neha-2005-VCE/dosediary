import { Component } from '@angular/core';

@Component({
  selector: 'app-project-status',
  standalone: true,
  template: `
    <div class="max-w-7xl mx-auto space-y-16 p-10 lg:p-20 font-sans min-h-screen bg-[#0a0a0a]">
      <!-- Header Section -->
      <div class="space-y-6 relative">
        <div class="absolute -top-20 -left-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
        
        <div class="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-500/5">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          Protocol Version: 3.1
        </div>
        
        <h1 class="text-6xl font-black text-white tracking-tight leading-none">
          System Architecture <br>
          <span class="text-slate-600">& Neural Core Status</span>
        </h1>
        
        <p class="text-xl text-slate-400 max-w-3xl leading-relaxed font-medium">
          DoseDiary is a precision-engineered pharmaceutical ecosystem built on **Spring Boot Security** and **Angular Signals**.
        </p>
      </div>

      <!-- Core Modules -->
      <section class="space-y-8">
        <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.4em] ml-2 flex items-center gap-4">
           <span class="w-10 h-[1px] bg-slate-800"></span>
           01 / Functional Core
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
             <div class="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center text-brand-500 shadow-xl shadow-brand-500/10">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
             </div>
             <h3 class="text-2xl font-black text-white tracking-tight">JWT Guarded</h3>
             <p class="text-slate-500 font-bold text-sm leading-relaxed">State-of-the-art authentication using Spring Security 6 with stateless JWT tokens and CSRF protection.</p>
          </div>

          <div class="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
             <div class="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/10">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
             </div>
             <h3 class="text-2xl font-black text-white tracking-tight">Signal State</h3>
             <p class="text-slate-500 font-bold text-sm leading-relaxed">Reactive state management using Angular 19+ Signals for flicker-free UI synchronization.</p>
          </div>

          <div class="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
             <div class="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 shadow-xl shadow-orange-500/10">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
             </div>
             <h3 class="text-2xl font-black text-white tracking-tight">Audit Memory</h3>
             <p class="text-slate-500 font-bold text-sm leading-relaxed">Immutable history snapshots for every prescription modification, ensuring 100% data traceability.</p>
          </div>
        </div>
      </section>

      <!-- Code Manifest -->
      <section class="space-y-8">
         <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.4em] ml-2 flex items-center gap-4">
           <span class="w-10 h-[1px] bg-slate-800"></span>
           02 / Operational Logic
         </h2>
         <div class="bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
            <div class="p-4 bg-white/5 border-b border-white/5 flex items-center gap-2">
               <div class="w-3 h-3 rounded-full bg-red-500/40"></div>
               <div class="w-3 h-3 rounded-full bg-orange-500/40"></div>
               <div class="w-3 h-3 rounded-full bg-green-500/40"></div>
               <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">medication.service.ts — Encrypted Sequence</span>
            </div>
            <div class="p-10 font-mono text-sm leading-relaxed overflow-x-auto text-slate-300">
               <p class="text-brand-500 font-black mb-4 uppercase tracking-tighter">// Immutable Update Pattern</p>
               <div class="space-y-1">
                 <div>updatePrescription(id: string, updates: Partial&lt;Prescription&gt;, reason: string) &#123;</div>
                 <div class="pl-4 text-slate-500 italic">// Generate cryptographic history snapshot</div>
                 <div class="pl-4">this.prescriptions.update(items => items.map(p => &#123;</div>
                 <div class="pl-8">if (p.id === id) &#123;</div>
                 <div class="pl-12">const version: PrescriptionVersion = &#123;</div>
                 <div class="pl-16">updatedAt: new Date().toISOString(),</div>
                 <div class="pl-16">updatedBy: doctor.fullName,</div>
                 <div class="pl-16">reason: reason,</div>
                 <div class="pl-16">previousContent: &#123; ...p &#125;</div>
                 <div class="pl-12">&#125;;</div>
                 <div class="pl-12">return &#123; ...p, ...updates, history: [version, ...p.history] &#125;;</div>
                 <div class="pl-8">&#125;</div>
                 <div class="pl-8">return p;</div>
                 <div class="pl-4">&#125;));</div>
                 <div>&#125;</div>
               </div>
            </div>
         </div>
      </section>
    </div>
  `
})
export class ProjectStatusComponent { }