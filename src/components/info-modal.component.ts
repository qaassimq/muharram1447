import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300"
      [class.hidden]="!isVisible()"
      (click)="onBackdropClick($event)"
    >
      <div class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 relative text-right transform transition-all duration-300 scale-100">
        <!-- Close Button -->
        <button 
          (click)="onClose()"
          class="absolute top-6 left-6 p-2 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 transition-all duration-300 transform hover:scale-110"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">عن التطبيق</h2>
          </div>
          
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            هذا التطبيق يسهّل عليك استكشاف مجالس ومآتم عاشوراء في البحرين لموسم ١٤٤٧ هـ. 
            يمكنك البحث والتصفية حسب المدينة، القارئ، الوقت، وترتيب النتائج بسهولة.
          </p>
        </div>
        
        <!-- Features List -->
        <div class="space-y-4 mb-8">
          <div class="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-colors duration-300">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">البحث المتقدم</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">ابحث باسم المأتم أو القارئ بسهولة</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 hover:bg-green-50/80 dark:hover:bg-green-900/20 transition-colors duration-300">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">فلترة ذكية</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">تصفية حسب المدينة والوقت والقارئ</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 hover:bg-purple-50/80 dark:hover:bg-purple-900/20 transition-colors duration-300">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">الأوقات القادمة</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">عرض المجالس القادمة فقط</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 hover:bg-orange-50/80 dark:hover:bg-orange-900/20 transition-colors duration-300">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">مشاركة سهلة</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">شارك الروابط مع الفلاتر المفعلة</p>
            </div>
          </div>
        </div>
        
        <!-- Close Button -->
        <div class="text-center">
          <button 
            (click)="onClose()"
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes modalEnter {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    div:not(.hidden) > div {
      animation: modalEnter 0.3s ease-out;
    }
  `]
})
export class InfoModalComponent {
  isVisible = input.required<boolean>();
  close = output<void>();

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}