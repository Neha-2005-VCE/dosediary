import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { GeminiService } from '../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto bg-[#111] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden relative">
      <!-- Glow Effect -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>

      <!-- Header -->
      <div class="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between relative z-10">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shadow-lg shadow-brand-500/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M19 11v1a5 5 0 0 1-5 5v0a5 5 0 0 1-5-5v-1"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>
          </div>
          <div>
            <h2 class="text-xl font-black text-white tracking-tight leading-none">AROMI AI</h2>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2 flex items-center gap-2">
               <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
               Neural Health Core Active
            </p>
          </div>
        </div>
        <div class="hidden md:block">
           <span class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-xl border border-white/10">
             V2.4 Gemini Core
           </span>
        </div>
      </div>

      <!-- Messages Area -->
      <div #scrollContainer class="flex-1 overflow-y-auto p-8 space-y-6 bg-black/10">
        @if (messages().length === 0) {
          <div class="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div class="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-slate-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-40"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <p class="text-2xl font-black text-white tracking-tight">How can I assist your health journey?</p>
              <p class="text-slate-400 mt-2 max-w-sm mx-auto font-medium">I'm your dedicated AI wellness companion, trained on specialized medical protocols.</p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl pt-6">
               <button (click)="quickAsk('What are common side effects of antibiotics?')" class="text-xs text-left p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all group active:scale-[0.98]">
                 <p class="font-black opacity-60 group-hover:opacity-100 uppercase tracking-widest mb-1 text-[10px]">Pharmacology</p>
                 <span class="font-bold">Antibiotic side effects?</span>
               </button>
               <button (click)="quickAsk('How can I remember to take my meds?')" class="text-xs text-left p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all group active:scale-[0.98]">
                 <p class="font-black opacity-60 group-hover:opacity-100 uppercase tracking-widest mb-1 text-[10px]">Adherence</p>
                 <span class="font-bold">Medication reminders?</span>
               </button>
            </div>
          </div>
        }

        @for (msg of messages(); track msg.id) {
          <div [class]="'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')">
            <div [class]="'max-w-[85%] rounded-[2rem] px-6 py-4 shadow-2xl ' + (msg.role === 'user' ? 'bg-brand-500 text-black rounded-br-none' : 'bg-[#1a1a1a] text-slate-200 border border-white/5 rounded-bl-none')">
              <p class="text-sm font-bold leading-relaxed whitespace-pre-wrap">{{ msg.text }}</p>
              <div [class]="'text-[9px] mt-2 font-black uppercase tracking-widest flex items-center gap-2 ' + (msg.role === 'user' ? 'text-black/40' : 'text-slate-500')">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ msg.timestamp | date:'shortTime' }}
                <span class="mx-1">•</span>
                {{ msg.role === 'user' ? 'Patient' : 'AROMI System' }}
              </div>
            </div>
          </div>
        }

        @if (isLoading()) {
          <div class="flex justify-start">
            <div class="bg-[#1a1a1a] border border-white/5 rounded-[2rem] rounded-bl-none px-6 py-4 shadow-2xl flex items-center gap-2">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Thinking</span>
              <div class="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              <div class="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>
          </div>
        }
      </div>

      <!-- Input Area -->
      <div class="p-8 bg-black/40 border-t border-white/5 relative z-10 backdrop-blur-xl">
        <form (ngSubmit)="sendMessage()" class="relative flex items-center gap-4">
          <div class="relative flex-1 group">
            <input 
              type="text" 
              [(ngModel)]="userInput" 
              name="userInput"
              placeholder="Ask about medications, side effects, or general health..." 
              class="w-full pl-6 pr-14 py-4 bg-black/60 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold"
              [disabled]="isLoading()"
            >
            <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button 
                type="submit" 
                [disabled]="!userInput.trim() || isLoading()"
                class="p-2.5 bg-brand-500 text-black rounded-xl hover:bg-brand-400 disabled:opacity-20 disabled:grayscale transition-all active:scale-95 shadow-lg shadow-brand-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </form>
        <div class="flex items-center justify-center gap-2 mt-4">
           <div class="w-1.5 h-1.5 rounded-full bg-red-500/40"></div>
           <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
             Official medical advice requires a verified physician consultation
           </p>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent implements AfterViewChecked {
  private geminiService = inject(GeminiService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages = signal<Message[]>([]);
  userInput = '';
  isLoading = signal(false);

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: this.userInput,
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    const prompt = this.userInput;
    this.userInput = '';
    this.isLoading.set(true);

    try {
      const response = await this.geminiService.chat(prompt, this.messages());

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: response,
        timestamp: new Date()
      };

      this.messages.update(msgs => [...msgs, aiMsg]);
    } catch (err) {
      console.error(err);
      // Handle error gracefully in UI
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: "I apologize, but I'm unable to process your request at the moment. Please try again later.",
        timestamp: new Date()
      };
      this.messages.update(msgs => [...msgs, errorMsg]);
    } finally {
      this.isLoading.set(false);
    }
  }

  quickAsk(text: string) {
    this.userInput = text;
    this.sendMessage();
  }
}