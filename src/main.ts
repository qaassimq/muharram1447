import { Component, signal, computed, effect, ViewChild, ElementRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { majalisData, MatamReading } from './data/matam-data';
import { HeaderComponent } from './components/header.component';
import { FiltersComponent, FilterState } from './components/filters.component';
import { MatamCardComponent } from './components/matam-card.component';
import { InfoModalComponent } from './components/info-modal.component';
import { FilterService } from './services/filter.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    FiltersComponent, 
    MatamCardComponent, 
    InfoModalComponent
  ],
  providers: [FilterService],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500" [attr.dir]="'rtl'" [attr.lang]="'ar'">
      <div class="container mx-auto px-4 md:px-8 py-8">
        <app-header
          (infoClick)="showInfoModal.set(true)"
          (mobileFilterToggle)="toggleMobileFilters()"
          (themeToggle)="toggleTheme($event)"
          #header
        />

        <app-filters
          [data]="majalisData"
          (filtersChange)="onFiltersChange($event)"
          (applyFilters)="applyFilters()"
          (clearFilters)="clearFilters()"
          (closeFilters)="closeMobileFilters()"
          #filters
        />

        <!-- Results Count -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">
              عرض {{ filteredData().length }} من {{ majalisData.length }} مجلس
            </span>
          </div>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600 mb-6"></div>
            <p class="text-xl text-gray-500 dark:text-gray-400 font-medium">جاري التحميل...</p>
          </div>
        }

        <!-- Results Grid -->
        @if (!isLoading() && filteredData().length > 0) {
          <main class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            @for (matam of filteredData(); track matam.matam + matam.reader + matam.time; let i = $index) {
              <div 
                class="animate-card-enter"
                [style.animation-delay]="(i * 100) + 'ms'"
              >
                <app-matam-card
                  [matam]="matam"
                  (filterByMatam)="filterByMatam($event)"
                  (filterByReader)="filterByReader($event)"
                />
              </div>
            }
          </main>
        }

        <!-- No Results State -->
        @if (!isLoading() && filteredData().length === 0) {
          <div class="text-center py-20">
            <div class="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gray-100 dark:bg-gray-800 mb-6">
              <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v2.306"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">لا توجد نتائج</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">لم نجد أي مجالس تطابق معايير البحث الخاصة بك. جرب تعديل الفلاتر أو مسحها.</p>
            <button 
              (click)="clearFilters()"
              class="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              مسح جميع الفلاتر
            </button>
          </div>
        }

        <!-- Floating Action Buttons -->
        <div class="fixed bottom-6 right-6 flex flex-col gap-4 z-20">
          <!-- Share Button -->
          <button 
            (click)="shareUrl()"
            class="group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="مشاركة الرابط"
          >
            <svg class="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
          </button>

          <!-- Mobile Filter Toggle -->
          <button 
            (click)="toggleMobileFilters()"
            class="group lg:hidden flex items-center justify-center w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="فتح الفلاتر"
          >
            <svg class="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </button>
        </div>

        <app-info-modal
          [isVisible]="showInfoModal()"
          (close)="showInfoModal.set(false)"
        />
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes cardEnter {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .animate-card-enter {
      animation: cardEnter 0.6s ease-out forwards;
      opacity: 0;
    }
  `]
})
export class App {
  @ViewChild('header') headerComponent!: HeaderComponent;
  @ViewChild('filters') filtersComponent!: FiltersComponent;

  majalisData = majalisData;
  
  // Signals
  currentFilters = signal<FilterState>({
    city: '',
    reader: '',
    matam: '',
    time: '',
    currentTime: '',
    sort: ''
  });
  
  showInfoModal = signal(false);
  isLoading = signal(false);
  isDarkMode = signal(true);

  // Computed values
  filteredData = computed(() => {
    const filters = this.currentFilters();
    let filtered = this.filterService.filterData(this.majalisData, filters);
    
    if (filters.sort) {
      filtered = this.filterService.sortData(filtered, filters.sort);
    }
    
    return filtered;
  });

  hasActiveFilters = computed(() => {
    const filters = this.currentFilters();
    return !!(filters.city || filters.reader || filters.matam || filters.time || filters.currentTime || filters.sort);
  });

  constructor(private filterService: FilterService) {
    // Initialize theme
    this.initializeTheme();
    
    // Load filters from URL on startup
    this.loadFiltersFromURL();
    
    // Update header when filters change
    effect(() => {
      if (this.headerComponent) {
        this.headerComponent.setHasActiveFilters(this.hasActiveFilters());
      }
    });
  }

  private initializeTheme() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      this.isDarkMode.set(shouldBeDark);
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  private loadFiltersFromURL() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const filters: FilterState = {
        city: params.get('city') || '',
        reader: params.get('reader') || '',
        matam: params.get('matam') || '',
        time: params.get('time') || '',
        currentTime: params.get('currentTime') || '',
        sort: params.get('sort') || ''
      };
      
      this.currentFilters.set(filters);
      
      // Update filters component if it exists
      setTimeout(() => {
        if (this.filtersComponent) {
          this.filtersComponent.setFilters(filters);
        }
      });
    }
  }

  private updateURL() {
    if (typeof window !== 'undefined') {
      const filters = this.currentFilters();
      const params = new URLSearchParams();

      if (filters.city) params.set('city', filters.city);
      if (filters.reader) params.set('reader', filters.reader);
      if (filters.matam) params.set('matam', filters.matam);
      if (filters.time) params.set('time', filters.time);
      if (filters.currentTime) params.set('currentTime', filters.currentTime);
      if (filters.sort) params.set('sort', filters.sort);

      const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }
  }

  onFiltersChange(filters: FilterState) {
    this.currentFilters.set(filters);
    this.updateURL();
  }

  applyFilters() {
    this.isLoading.set(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      this.isLoading.set(false);
    }, 300);
  }

  clearFilters() {
    const emptyFilters: FilterState = {
      city: '',
      reader: '',
      matam: '',
      time: '',
      currentTime: '',
      sort: ''
    };
    
    this.currentFilters.set(emptyFilters);
    
    if (this.filtersComponent) {
      this.filtersComponent.setFilters(emptyFilters);
    }
    
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
    }
  }

  filterByMatam(matamName: string) {
    const newFilters: FilterState = {
      city: '',
      reader: '',
      matam: matamName,
      time: '',
      currentTime: '',
      sort: ''
    };
    
    this.currentFilters.set(newFilters);
    
    if (this.filtersComponent) {
      this.filtersComponent.setFilters(newFilters);
    }
    
    this.updateURL();
    this.scrollToResults();
  }

  filterByReader(readerName: string) {
    const newFilters: FilterState = {
      city: '',
      reader: readerName,
      matam: '',
      time: '',
      currentTime: '',
      sort: ''
    };
    
    this.currentFilters.set(newFilters);
    
    if (this.filtersComponent) {
      this.filtersComponent.setFilters(newFilters);
    }
    
    this.updateURL();
    this.scrollToResults();
  }

  toggleMobileFilters() {
    if (this.filtersComponent) {
      const isCurrentlyHidden = this.filtersComponent.isHidden();
      this.filtersComponent.setHidden(!isCurrentlyHidden);
    }
  }

  closeMobileFilters() {
    if (this.filtersComponent) {
      this.filtersComponent.setHidden(true);
    }
  }

  toggleTheme(isDark: boolean) {
    this.isDarkMode.set(isDark);
    
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
    
    if (this.headerComponent) {
      this.headerComponent.setDarkMode(isDark);
    }
  }

  async shareUrl() {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'دليل عاشوراء البحرين 1447',
            url: url
          });
        } catch (err) {
          // User cancelled or error
        }
      } else {
        try {
          await navigator.clipboard.writeText(url);
          // Could add a toast notification here
          alert('تم نسخ الرابط!');
        } catch (err) {
          alert('لم يتمكن المتصفح من نسخ الرابط');
        }
      }
    }
  }

  private scrollToResults() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const resultsElement = document.querySelector('main');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }
}

bootstrapApplication(App);