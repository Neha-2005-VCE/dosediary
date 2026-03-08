import { Component, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';
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
           <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
           <span class="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Low Stock Alerts</span>
           <p class="text-5xl font-black text-white mt-4">0</p>
        </div>
        <div class="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
           <div class="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-500/10 transition-colors"></div>
           <span class="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Pending Orders</span>
           <p class="text-5xl font-black text-white mt-4">0</p>
        </div>
      </div>
      
      <div class="bg-[#111] rounded-[2.5rem] border border-white/5 p-20 text-center relative overflow-hidden shadow-2xl">
         <div class="absolute inset-0 bg-brand-500/5 blur-[100px] pointer-events-none"></div>
         <div class="relative z-10">
           <div class="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto text-slate-500 mb-8 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
           </div>
           <h3 class="text-3xl font-black text-white tracking-tight">Module encrypted</h3>
           <p class="text-slate-400 mt-4 text-lg max-w-md mx-auto leading-relaxed">Inventory and logistics protocols will be accessible in <span class="text-brand-500 font-bold">Week 6</span>.</p>
         </div>
      </div>
    </div>
  `
})
export class PharmacistDashboardComponent { }