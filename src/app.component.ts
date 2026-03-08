import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { StoreService } from './services/store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    @if (!store.isLoggedIn()) {
      <router-outlet></router-outlet>
    } @else {
      <div class="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
        <!-- Sidebar (Desktop) -->
        <aside class="w-72 bg-[#111] border-r border-white/5 hidden lg:flex flex-col z-10">
          <div class="p-8 pb-4 flex items-center gap-4">
            <div class="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-black font-black shadow-lg shadow-brand-500/20">
              DD
            </div>
            <span class="text-2xl font-black text-white tracking-tighter">DoseDiary</span>
          </div>

          <nav class="flex-1 px-4 space-y-1.5 mt-8 overflow-y-auto">
            <a routerLink="/dashboard" routerLinkActive="bg-brand-500/10 text-brand-500" class="flex items-center gap-3.5 px-5 py-4 text-slate-400 rounded-2xl hover:bg-white/5 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              <span class="font-bold tracking-tight">Dashboard</span>
            </a>
            
            <a routerLink="/medications" routerLinkActive="bg-brand-500/10 text-brand-500" class="flex items-center gap-3.5 px-5 py-4 text-slate-400 rounded-2xl hover:bg-white/5 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>
              <span class="font-bold tracking-tight">Prescriptions</span>
            </a>

            <a routerLink="/add" routerLinkActive="bg-brand-500/10 text-brand-500" class="flex items-center gap-3.5 px-5 py-4 text-slate-400 rounded-2xl hover:bg-white/5 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span class="font-bold tracking-tight">Reminders</span>
            </a>

            <a routerLink="/assistant" routerLinkActive="bg-brand-500/10 text-brand-500" class="flex items-center gap-3.5 px-5 py-4 text-slate-400 rounded-2xl hover:bg-white/5 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span class="font-bold tracking-tight">AI Assistant</span>
            </a>
          </nav>

          <div class="p-6">
            <button (click)="store.logout()" class="w-full flex items-center justify-center gap-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 p-4 rounded-2xl transition-all font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Logout
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 flex flex-col h-full overflow-hidden relative">
          <div class="flex-1 overflow-auto bg-[#0a0a0a] pb-24 lg:pb-0">
            <div class="container mx-auto p-6 lg:p-10 max-w-7xl">
              <router-outlet></router-outlet>
            </div>
          </div>

          <!-- Bottom Navigation (Mobile) -->
          <nav class="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] flex items-center justify-between px-6 z-50">
            <a routerLink="/dashboard" routerLinkActive="text-brand-500" class="flex flex-col items-center gap-1.5 px-4 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span class="text-[10px] font-black uppercase tracking-tighter">Dashboard</span>
            </a>
            <a routerLink="/medications" routerLinkActive="text-brand-500" class="flex flex-col items-center gap-1.5 px-4 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span class="text-[10px] font-black uppercase tracking-tighter">Prescriptions</span>
            </a>
            <a routerLink="/add" routerLinkActive="text-brand-500" class="flex flex-col items-center gap-1.5 px-4 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span class="text-[10px] font-black uppercase tracking-tighter">Reminders</span>
            </a>
            <a routerLink="/assistant" routerLinkActive="text-brand-500" class="flex flex-col items-center gap-1.5 px-4 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span class="text-[10px] font-black uppercase tracking-tighter">Assistant</span>
            </a>
          </nav>
        </main>
      </div>
    }
  `
})
export class AppComponent {
  store = inject(StoreService);
}