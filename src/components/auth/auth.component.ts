import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { UserRole } from '../../models/types';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      <div class="w-full max-w-lg space-y-8">
        <!-- Logo/Header -->
        <div class="text-center">
          <div class="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto text-black font-black text-2xl mb-4 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            DD
          </div>
          <h1 class="text-3xl font-bold text-white tracking-tight">DoseDiary</h1>
          <p class="text-slate-400 mt-2">Precision Prescription Management</p>
        </div>

        <div class="bg-[#111] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <!-- Toggle -->
          <div class="flex p-2 bg-black/40 m-4 rounded-xl gap-2">
            <button (click)="mode.set('login')" [class]="'flex-1 py-3 text-sm font-bold rounded-lg transition-all ' + (mode() === 'login' ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-white')">Sign In</button>
            <button (click)="mode.set('register')" [class]="'flex-1 py-3 text-sm font-bold rounded-lg transition-all ' + (mode() === 'register' ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-white')">Sign Up</button>
          </div>

          <!-- Login Form -->
          @if (mode() === 'login') {
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="p-8 pt-4 space-y-6">
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                  <input formControlName="email" type="email" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="Enter your email">
                </div>
                
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                  <input formControlName="password" type="password" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="••••••••">
                </div>
              </div>

              @if (error()) {
                <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
                  {{ error() }}
                </div>
              }

              <button type="submit" [disabled]="loginForm.invalid" class="w-full py-4 bg-brand-500 text-black rounded-2xl font-black hover:bg-brand-400 transition-all shadow-xl shadow-brand-500/25 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100">
                Sign In
              </button>
              
              <div class="text-center">
                <a href="#" class="text-xs font-medium text-brand-500 hover:text-brand-400 transition-colors">Forgot Password?</a>
              </div>
            </form>
          }

          <!-- Register Form -->
          @if (mode() === 'register') {
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="p-8 pt-4 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input formControlName="fullName" type="text" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="John Doe">
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                  <input formControlName="email" type="email" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="you@example.com">
                </div>
                
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                  <input formControlName="password" type="password" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="Create a password">
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Select Role</label>
                  <select formControlName="role" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all appearance-none cursor-pointer">
                    <option value="PATIENT">Patient Identifier</option>
                    <option value="DOCTOR">Medical Professional</option>
                    <option value="PHARMACIST">Pharmaceutical Agent</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                <!-- Role Specific Fields -->
                @if (registerForm.get('role')?.value === 'DOCTOR') {
                  <div class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Medical License Number</label>
                      <input formControlName="medicalLicenseNumber" type="text" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="MD-12345678">
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Specialization</label>
                      <input formControlName="specialization" type="text" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="e.g. Cardiology">
                    </div>
                  </div>
                }

                @if (registerForm.get('role')?.value === 'PATIENT') {
                   <div class="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Medical History</label>
                    <textarea formControlName="medicalHistory" rows="3" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="Please provide any relevant medical history..."></textarea>
                  </div>
                }
                
                @if (registerForm.get('role')?.value === 'PHARMACIST') {
                   <div class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Pharmacy Name</label>
                      <input formControlName="pharmacyName" type="text" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="e.g. Health Plus Pharmacy">
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Shop Details & Address</label>
                      <textarea formControlName="shopDetails" rows="2" class="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all" placeholder="Shop address, contact info..."></textarea>
                    </div>
                  </div>
                }
              </div>

              <button type="submit" [disabled]="registerForm.invalid" class="w-full py-4 bg-brand-500 text-black rounded-2xl font-black hover:bg-brand-400 transition-all shadow-xl shadow-brand-500/25 active:scale-[0.98] disabled:opacity-50">
                Sign Up
              </button>
            </form>
          }
        </div>
        
        <p class="text-center text-slate-500 text-sm">
          By continuing, you agree to our <a href="#" class="text-slate-400 font-bold">Terms of Service</a>
        </p>
      </div>
    </div>
  `
})
export class AuthComponent {
  store = inject(StoreService);
  router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);

  mode = signal<'login' | 'register'>('login');
  error = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['PATIENT' as UserRole, Validators.required],
    medicalLicenseNumber: [''],
    specialization: [''],
    medicalHistory: [''],
    pharmacyName: [''],
    shopDetails: ['']
  });

  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const success = await this.store.login(email!, password!);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Invalid credentials or server error');
      }
    }
  }

  async onRegister() {
    if (this.registerForm.valid) {
      try {
        await this.store.register(this.registerForm.value);
        this.router.navigate(['/dashboard']);
      } catch (err) {
        this.error.set('Registration failed. Please try again.');
      }
    }
  }
}