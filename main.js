

document.addEventListener('DOMContentLoaded', () => {
    const cityFilter = document.getElementById('city-filter');
    const readerFilter = document.getElementById('reader-filter');
    const matamFilter = document.getElementById('matam-filter');
    const timeFilter = document.getElementById('time-filter');
    const resultsGrid = document.getElementById('results-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const clearFiltersButton = document.getElementById('clear-filters');
    const applyFiltersButton = document.getElementById('apply-filters');
    const filterContainer = document.querySelector('.bg-white.sticky');
    
    // Add floating filter button to the DOM
    const filterButton = document.createElement('button');
    filterButton.id = 'filter-toggle';
    filterButton.className = 'fixed bottom-4 left-4 z-20 bg-red-700 text-white p-3 rounded-full shadow-lg md:hidden';
    filterButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
    `;
    document.body.appendChild(filterButton);
    
    // Force hide filters on mobile immediately
    if (window.innerWidth < 768) {
        // Add a small delay to ensure the class is applied after the DOM is fully loaded
        setTimeout(() => {
            filterContainer.classList.add('filters-hidden');
        }, 0);
    }
    
    // Toggle filters visibility when button is clicked
    filterButton.addEventListener('click', () => {
        filterContainer.classList.toggle('filters-hidden');
        // No need to add popup styling, just show/hide the existing filters
    });

    // Performance optimization - Create document fragment for batch DOM updates
    const createCardFragment = (data) => {
        const fragment = document.createDocumentFragment();
        
        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col card-enter relative';
            card.style.animationDelay = `${Math.min(index * 30, 300)}ms`; // Cap delay for better UX

            const locationQuery = encodeURIComponent(`${item.matam}, ${item.city}, Bahrain`);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
            const instagramUrl = item.instagram || `https://www.instagram.com/yowahedona`;

            card.innerHTML = `
                <div class="p-5 flex-grow">
                    <p class="text-sm text-red-600 font-semibold mb-1">${item.city}</p>
                    <div class="flex items-center justify-between">
                        <h3 class="font-bold text-xl text-gray-800 mb-3">${item.matam}</h3>
                        <button class="filter-icon cursor-pointer p-1 rounded-full hover:bg-gray-100" onclick="filterByMatam('${item.matam}')" title="فلترة حسب هذا المأتم">
                            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-3 text-gray-600">
                        <div class="flex items-center justify-between">
                            <p class="flex items-center flex-grow">
                                <svg class="w-5 h-5 ml-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 119 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                                <span class="font-semibold">القارئ:</span>&nbsp;<span>${item.reader}</span>
                            </p>
                            <button class="filter-icon cursor-pointer p-1 rounded-full hover:bg-gray-100" onclick="filterByReader('${item.reader}')" title="فلترة حسب هذا القارئ">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                                </svg>
                            </button>
                        </div>
                        <p class="flex items-center">
                             <svg class="w-5 h-5 ml-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clip-rule="evenodd" /></svg>
                            <span class="font-semibold">الوقت:</span>&nbsp;<span>${item.time}</span>
                        </p>
                    </div>
                </div>
                <div class="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-end space-x-2 space-x-reverse">
                    ${item.instagram ? `
                    <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-md hover:opacity-90 transition-opacity text-sm">
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.231 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.275-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.884a1.161 1.161 0 1 0 0 2.322 1.161 1.161 0 0 0 0-2.322zM8 4.882a3.118 3.118 0 1 0 0 6.236 3.118 3.118 0 0 0 0-6.236zM8 9.24a1.24 1.24 0 1 1 0-2.48 1.24 1.24 0 0 1 0 2.48z"/></svg>
                    </a>
                    ` : ''}
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                    </a>
                </div>
            `;
            fragment.appendChild(card);
        });
        
        return fragment;
    };

    // Populate city filter dropdown - only do this once
    const populateCityFilter = () => {
        const cities = [...new Set(majalisData.map(item => item.city))].sort();
        const cityFragment = document.createDocumentFragment();
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityFragment.appendChild(option);
        });
        
        cityFilter.appendChild(cityFragment);
    };

    // Helper function to determine time category - memoized for performance
    const timeCategories = new Map();
    const getTimeCategory = (timeString) => {
        if (!timeString) return '';
        
        if (timeCategories.has(timeString)) {
            return timeCategories.get(timeString);
        }
        
        let category = '';
        if (timeString.includes('صباحًا') || timeString.includes('صباحاً')) {
            category = 'صباحا';
        } else if (timeString.includes('ظهراً') || timeString.includes('الظهرين')) {
            category = 'ظهرا';
        } else if (timeString.includes('عصراً') || timeString.includes('عصرًا')) {
            category = 'عصرا';
        } else if (timeString.includes('مساءً') || timeString.includes('مساءا') || timeString.includes('العشاءين')) {
            category = 'مساءا';
        }
        
        timeCategories.set(timeString, category);
        return category;
    };

    // Debounce function for search inputs
    const debounce = (func, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const renderResults = (data) => {
        resultsGrid.innerHTML = '';
        resultsCount.textContent = `عرض ${data.length} من ${majalisData.length} مجلس`;
        noResults.classList.toggle('hidden', data.length > 0);
        
        if (data.length > 0) {
            const fragment = createCardFragment(data);
            resultsGrid.appendChild(fragment);
        }
    };

    const applyFilters = debounce(() => {
        const city = cityFilter.value;
        const reader = readerFilter.value.toLowerCase();
        const matam = matamFilter.value.toLowerCase();
        const time = timeFilter.value;

        const filteredData = majalisData.filter(item =>
            (!city || item.city === city) &&
            (!reader || item.reader.toLowerCase().includes(reader)) &&
            (!matam || item.matam.toLowerCase().includes(matam)) &&
            (!time || getTimeCategory(item.time) === time)
        );

        renderResults(filteredData);
        
        // Hide filters after applying on mobile
        if (window.innerWidth < 768) {
            filterContainer.classList.add('filters-hidden');
        }
    }, 200); // 200ms debounce for smoother filtering

    // Global functions to filter by reader or matam
    window.filterByReader = (readerName) => {
        cityFilter.value = '';
        readerFilter.value = readerName;
        matamFilter.value = '';
        timeFilter.value = '';
        applyFilters();
        
        // Scroll to results
        resultsCount.scrollIntoView({ behavior: 'smooth' });
    };
    
    window.filterByMatam = (matamName) => {
        cityFilter.value = '';
        readerFilter.value = '';
        matamFilter.value = matamName;
        timeFilter.value = '';
        applyFilters();
        
        // Scroll to results
        resultsCount.scrollIntoView({ behavior: 'smooth' });
    };

    const clearFilters = () => {
        cityFilter.value = '';
        readerFilter.value = '';
        matamFilter.value = '';
        timeFilter.value = '';
        applyFilters();
    };

    // Setup filter event listeners based on device type
    function setupFilterEventListeners() {
        // Remove existing event listeners
        cityFilter.removeEventListener('change', applyFilters);
        readerFilter.removeEventListener('input', applyFilters);
        matamFilter.removeEventListener('input', applyFilters);
        timeFilter.removeEventListener('change', applyFilters);
        
        // For desktop: apply filters immediately
        if (window.innerWidth >= 768) {
            cityFilter.addEventListener('change', applyFilters);
            readerFilter.addEventListener('input', applyFilters);
            matamFilter.addEventListener('input', applyFilters);
            timeFilter.addEventListener('change', applyFilters);
        }
        // For mobile: don't add any event listeners that apply filters
        // Filters will only be applied when the Apply button is clicked
    }
    
    // Initial setup of event listeners
    setupFilterEventListeners();
    
    // Update event listeners when window is resized
    window.addEventListener('resize', () => {
        setupFilterEventListeners();
        
        if (window.innerWidth >= 768) {
            filterContainer.classList.remove('filters-hidden');
        } else {
            filterContainer.classList.add('filters-hidden');
        }
    });
    
    // Apply filters button event listener
    applyFiltersButton.addEventListener('click', () => {
        applyFilters();
    });

    clearFiltersButton.addEventListener('click', () => {
        clearFilters();
        
        // Hide filters after clearing on mobile
        if (window.innerWidth < 768) {
            filterContainer.classList.add('filters-hidden');
        }
    });

    // Remove the duplicate DOMContentLoaded event listener
    // and keep only the scroll handling code
    
    // Variables for scroll detection
    let lastScrollTop = 0;
    const scrollThreshold = 50;
    let ticking = false;

    // Handle scroll events with requestAnimationFrame for better performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Only apply filter hiding on mobile/tablet
                if (window.innerWidth < 768) {
                    if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
                        filterContainer.classList.add('filters-hidden');
                        filterContainer.classList.remove('filter-popup');
                    }
                } else {
                    // Always show filters on desktop
                    filterContainer.classList.remove('filters-hidden');
                    filterContainer.classList.remove('filter-popup');
                }
                
                lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // Add resize listener to handle responsive behavior
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            filterContainer.classList.remove('filters-hidden');
            filterContainer.classList.remove('filter-popup');
        } else {
            filterContainer.classList.add('filters-hidden');
        }
    });

    // Initialize the page
    populateCityFilter();
    renderResults(majalisData);
});