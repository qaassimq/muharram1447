import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatamReading } from '../data/matam-data';

@Component({
  selector: 'app-matam-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 flex flex-col transform hover:-translate-y-2 hover:scale-[1.02]">
      <!-- Card Header -->
      <div class="relative p-6 pb-4">
        <!-- City Badge -->
        <div class="flex items-center justify-between mb-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-200/50 dark:border-red-700/50 rounded-2xl">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <span class="text-sm font-semibold text-red-600 dark:text-red-400">{{ matam().city }}</span>
          </div>
          
          <button 
            (click)="onFilterByMatam(matam().matam)"
            class="group/btn p-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-110" 
            title="فلترة حسب هذا المأتم"
          >
            <svg class="w-4 h-4 text-gray-500 group-hover/btn:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </button>
        </div>

        <!-- Matam Name -->
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300 leading-tight">
          {{ matam().matam }}
        </h3>
        
        <!-- Reader Info -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3 flex-1">
            <div class="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">القارئ</p>
              <p class="text-base font-semibold text-gray-800 dark:text-gray-200 truncate">{{ matam().reader }}</p>
            </div>
          </div>
          
          <button 
            (click)="onFilterByReader(matam().reader)"
            class="group/btn p-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110" 
            title="فلترة حسب هذا القارئ"
          >
            <svg class="w-4 h-4 text-gray-500 group-hover/btn:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </button>
        </div>
        
        <!-- Time Info -->
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-900/20">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">الوقت</p>
            <p class="text-base font-semibold text-gray-800 dark:text-gray-200">{{ matam().time }}</p>
          </div>
        </div>
      </div>
      
      <!-- Card Footer -->
      <div class="mt-auto p-6 pt-4 bg-gray-50/80 dark:bg-gray-800/80 border-t border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center justify-end gap-3">
          @if (matam().instagram) {
            <a 
              [href]="getInstagramUrl()" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="group/link flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              title="Instagram"
            >
              <svg class="w-5 h-5 transition-transform group-hover/link:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          }
          
          <a 
            [href]="getMapsUrl()" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="group/link flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="الموقع على الخريطة"
          >
            <svg class="w-5 h-5 transition-transform group-hover/link:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    :host {
      animation: fadeInUp 0.6s ease-out forwards;
    }
  `]
})
export class MatamCardComponent {
  matam = input.required<MatamReading>();
  
  filterByMatam = output<string>();
  filterByReader = output<string>();

  onFilterByMatam(matamName: string) {
    this.filterByMatam.emit(matamName);
  }

  onFilterByReader(readerName: string) {
    this.filterByReader.emit(readerName);
  }

  getMapsUrl(): string {
    const locationQuery = encodeURIComponent(`${this.matam().matam}, ${this.matam().city}, Bahrain`);
    return `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
  }

  getInstagramUrl(): string {
    return this.matam().instagram || 'https://www.instagram.com/yowahedona';
  }
}