import { Component, inject, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="max-w-7xl mx-auto space-y-10 p-6 lg:p-10 font-sans min-h-screen">
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-white tracking-tight">Admin Control Panel</h1>
        <p class="text-slate-400 text-lg ml-1">System-wide user oversight and security auditing.</p>
      </div>

      <div class="bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div class="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h2 class="text-xl font-black text-white tracking-tight flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M17 11a4 4 0 1 1 0-8"/></svg>
             User Directory
          </h2>
          <span class="text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            Total Entities: {{ store.users().length }}
          </span>
        </div>
        
        <div class="overflow-x-auto p-4 pt-0">
          <table class="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                <th class="p-6">Identity</th>
                <th class="p-6">Credentials</th>
                <th class="p-6">Access Role</th>
                <th class="p-6 text-right">System ID</th>
              </tr>
            </thead>
            <tbody>
              @for (user of store.users(); track user.id) {
                <tr class="bg-black/40 hover:bg-white/5 transition-all group rounded-2xl">
                  <td class="p-6 font-black text-white rounded-l-2xl">
                     <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-xl flex items-center justify-center text-xs font-black uppercase">
                          {{ user.fullName.substring(0,2) }}
                        </div>
                        {{ user.fullName }}
                     </div>
                  </td>
                  <td class="p-6 text-slate-400 font-medium text-sm">{{ user.email }}</td>
                  <td class="p-6">
                    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/5 text-slate-300 border border-white/10">
                      <span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="p-6 text-slate-600 text-[10px] font-black font-mono text-right rounded-r-2xl opacity-50">{{ user.id }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  store = inject(StoreService);

  ngOnInit() {
    // Fetch all users from backend
    this.store.loadUsers();
  }
}