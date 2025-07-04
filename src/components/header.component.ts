import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="text-center mb-12 relative">
      <!-- Main Header Content -->
      <div class="flex items-center justify-center gap-6 mb-6">
        <!-- Info Button -->
        <button 
          (click)="onInfoClick()" 
          title="عن التطبيق" 
          class="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-blue-600 dark:text-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <svg class="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>

        <!-- Title -->
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 dark:from-red-500 dark:via-red-600 dark:to-red-700 bg-clip-text text-transparent mb-2">
            دليل عاشوراء البحرين
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 font-medium">موسم ١٤٤٧ هـ</p>
        </div>

        <!-- Mobile Filter Toggle -->
        <button 
          (click)="onMobileFilterToggle()"
          class="md:hidden group flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600 dark:bg-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative"
        >
          <svg class="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          @if (hasActiveFilters()) {
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-black text-xs rounded-full flex items-center justify-center font-bold animate-pulse">!</span>
          }
        </button>
      </div>

      <!-- Theme Toggle -->
      <div class="flex justify-center">
        <label 
          class="group relative inline-flex items-center gap-4 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <!-- Moon Icon -->
          <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 transition-colors">
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </div>

          <!-- Toggle Switch -->
          <input 
            type="checkbox" 
            [checked]="isDarkMode()" 
            (change)="onThemeToggle()"
            class="sr-only" 
            aria-label="تبديل الوضع الليلي"
          >
          <div class="relative w-14 h-8 bg-gray-200 dark:bg-gray-600 rounded-full transition-colors duration-300">
            <div 
              class="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
              [class.translate-x-6]="isDarkMode()"
              [class.bg-yellow-400]="isDarkMode()"
            >
              @if (isDarkMode()) {
                <svg class="w-4 h-4 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L13.09 8.26L20 9L14 14.74L15.18 21.02L10 17.77L4.82 21.02L6 14.74L0 9L6.91 8.26L10 2Z"></path>
                </svg>
              }
            </div>
          </div>

          <!-- Sun Icon -->
          <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-yellow-100 dark:bg-gray-700 transition-colors">
            <svg class="w-5 h-5 text-yellow-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L13.09 8.26L20 9L14 14.74L15.18 21.02L10 17.77L4.82 21.02L6 14.74L0 9L6.91 8.26L10 2Z"></path>
            </svg>
          </div>
        </label>
      </div>
    </header>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { 
        opacity: 0; 
        transform: translateY(20px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    header {
      animation: fadeInUp 0.8s ease-out;
    }
  `]
})
export class HeaderComponent {
  isDarkMode = signal(true);
  hasActiveFilters = signal(false);
  
  infoClick = output<void>();
  mobileFilterToggle = output<void>();
  themeToggle = output<boolean>();

  onInfoClick() {
    this.infoClick.emit();
  }

  onMobileFilterToggle() {
    this.mobileFilterToggle.emit();
  }

  onThemeToggle() {
    const newTheme = !this.isDarkMode();
    this.isDarkMode.set(newTheme);
    this.themeToggle.emit(newTheme);
  }

  setHasActiveFilters(hasFilters: boolean) {
    this.hasActiveFilters.set(hasFilters);
  }

  setDarkMode(isDark: boolean) {
    this.isDarkMode.set(isDark);
  }
}