import { Component, signal, computed, output, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatamReading } from '../data/matam-data';

export interface FilterState {
  city: string;
  reader: string;
  matam: string;
  time: string;
  currentTime: string;
  sort: string;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div 
      class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl sticky top-6 z-10 transition-all duration-500"
      [class.filters-hidden]="isHidden()"
      [class.filters-appear]="!isHidden()"
      [class.mb-12]="!isHidden()"
      [class.mb-0]="isHidden()"
    >
      <div class="p-6 md:p-8">
        <!-- Filter Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <!-- City Filter -->
          <div class="space-y-2 md:space-y-3">
            <label for="city-filter" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                المدينة
              </div>
            </label>
            <select 
              id="city-filter" 
              [(ngModel)]="currentFilters.city"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 md:px-4 md:py-3 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 dark:text-gray-200 hover:shadow-lg backdrop-blur-sm text-sm md:text-base"
            >
              <option value="">جميع المدن</option>
              @for (city of cities(); track city) {
                <option [value]="city">{{ city }}</option>
              }
            </select>
          </div>
          
          <!-- Reader Filter -->
          <div class="space-y-2 md:space-y-3">
            <label for="reader-filter" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                القارئ
              </div>
            </label>
            <input 
              type="text" 
              id="reader-filter" 
              [(ngModel)]="currentFilters.reader"
              (ngModelChange)="onFilterChange()"
              placeholder="ابحث باسم القارئ..." 
              class="w-full px-3 py-2 md:px-4 md:py-3 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 hover:shadow-lg backdrop-blur-sm text-sm md:text-base"
            >
          </div>
          
          <!-- Matam Filter -->
          <div class="space-y-2 md:space-y-3">
            <label for="matam-filter" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
                </svg>
                المأتم
              </div>
            </label>
            <input 
              type="text" 
              id="matam-filter" 
              [(ngModel)]="currentFilters.matam"
              (ngModelChange)="onFilterChange()"
              placeholder="ابحث باسم المأتم..." 
              class="w-full px-3 py-2 md:px-4 md:py-3 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 hover:shadow-lg backdrop-blur-sm text-sm md:text-base"
            >
          </div>
          
          <!-- Time Filter -->
          <div class="space-y-2 md:space-y-3">
            <label for="time-filter" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                الوقت
              </div>
            </label>
            <select 
              id="time-filter" 
              [(ngModel)]="currentFilters.time"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 md:px-4 md:py-3 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 dark:text-gray-200 hover:shadow-lg backdrop-blur-sm text-sm md:text-base"
            >
              <option value="">جميع الأوقات</option>
              <option value="صباحا">صباحاً ☀️</option>
              <option value="ظهرا">ظهراً ☀️</option>
              <option value="عصرا">عصراً ☀️</option>
              <option value="مساءا">مساءً 🌙</option>
            </select>
          </div>
        </div>
        
        <!-- Advanced Filters - Hidden on Mobile -->
        <div class="hidden md:grid grid-cols-2 gap-6 mb-8">
          <div class="space-y-3">
            <label for="current-time-filter" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                الأوقات القادمة
              </div>
            </label>
            <select 
              id="current-time-filter" 
              [(ngModel)]="currentFilters.currentTime"
              (ngModelChange)="onFilterChange()"
              class="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 dark:text-gray-200 hover:shadow-lg backdrop-blur-sm"
            >
              <option value="">جميع الأوقات</option>
              <option value="upcoming">القادمة فقط ⏰</option>
            </select>
          </div>
          
          <div class="space-y-3">
            <label for="sort-filter" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
                ترتيب حسب الوقت
              </div>
            </label>
            <select 
              id="sort-filter" 
              [(ngModel)]="currentFilters.sort"
              (ngModelChange)="onFilterChange()"
              class="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 dark:text-gray-200 hover:shadow-lg backdrop-blur-sm"
            >
              <option value="">بدون ترتيب</option>
              <option value="time-asc">الأقرب زمنياً أولاً ⏰</option>
              <option value="time-desc">الأبعد زمنياً أولاً ⏰</option>
            </select>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <button 
            (click)="onApplyFilters()"
            class="group relative px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[140px] md:min-w-[160px]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-sm md:text-base">تطبيق الفلتر</span>
            </div>
          </button>
          
          <button 
            (click)="onClearFilters()"
            class="group relative px-6 py-2.5 md:px-8 md:py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[140px] md:min-w-[160px]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span class="text-sm md:text-base">مسح الفلاتر</span>
            </div>
          </button>
        </div>

        <!-- Mobile Close Button -->
        <button 
          (click)="onCloseFilters()"
          class="md:hidden mt-4 w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-300 text-sm"
        >
          إغلاق الفلاتر ✖️
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideDown {
      from { 
        opacity: 0; 
        transform: translateY(-20px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    .filters-appear {
      animation: slideDown 0.5s ease-out forwards;
    }
    
    .filters-hidden {
      display: none !important;
    }
    
    @media (max-width: 1023px) {
      .filters-appear {
        position: fixed !important;
        top: 1rem !important;
        left: 1rem !important;
        right: 1rem !important;
        z-index: 50 !important;
        margin-bottom: 0 !important;
      }
      
      .filters-hidden {
        display: none !important;
      }
    }
  `]
})
export class FiltersComponent {
  data = input.required<MatamReading[]>();
  isHidden = signal(false);
  
  // Use a regular object instead of signal for form binding
  currentFilters: FilterState = {
    city: '',
    reader: '',
    matam: '',
    time: '',
    currentTime: '',
    sort: ''
  };

  cities = computed(() => {
    return [...new Set(this.data().map(item => item.city))].sort();
  });

  filtersChange = output<FilterState>();
  applyFilters = output<void>();
  clearFilters = output<void>();
  closeFilters = output<void>();

  constructor() {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.isHidden.set(true);
    }
  }

  onFilterChange() {
    // Emit the current filter state
    this.filtersChange.emit({ ...this.currentFilters });
  }

  onApplyFilters() {
    this.applyFilters.emit();
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.isHidden.set(true);
    }
  }

  onClearFilters() {
    // Reset the filters
    this.currentFilters = {
      city: '',
      reader: '',
      matam: '',
      time: '',
      currentTime: '',
      sort: ''
    };
    this.clearFilters.emit();
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.isHidden.set(true);
    }
  }

  onCloseFilters() {
    this.closeFilters.emit();
  }

  setHidden(hidden: boolean) {
    this.isHidden.set(hidden);
  }

  setFilters(newFilters: FilterState) {
    // Update the current filters object
    this.currentFilters = { ...newFilters };
  }

  getFilters(): FilterState {
    return { ...this.currentFilters };
  }
}