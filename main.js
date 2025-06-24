document.addEventListener('DOMContentLoaded', () => {
    // Utility to load SVG from file and inject into element
    function loadSVG(element, svgPath, classList = '') {
        if (!element) return;
        fetch(svgPath)
            .then(res => res.text())
            .then(svg => {
                element.innerHTML = svg;
                if (classList) {
                    // Apply classes to the SVG root element
                    const svgEl = element.querySelector('svg');
                    if (svgEl) svgEl.setAttribute('class', classList);
                }
            });
    }

    // Load all static SVGs in the DOM (header, filter button, no-results)
    function loadStaticSVGs() {
        // Header filter icon
        loadSVG(document.querySelector('.svg-filter-toggle'), 'svg/filter-toggle.svg', 'h-6 w-6');
        // Bottom left filter button
        const filterToggleBtn = document.getElementById('filter-toggle');
        if (filterToggleBtn) {
            loadSVG(filterToggleBtn.querySelector('.svg-filter-toggle'), 'svg/filter-toggle.svg', 'h-6 w-6');
        }
        // No results icon
        loadSVG(document.querySelector('.svg-no-results'), 'svg/no-results.svg', 'mx-auto h-12 w-12 text-gray-400 dark:text-gray-500');
    }

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
    // Placeholder for SVG
    filterButton.innerHTML = `<span class="svg-filter-toggle"></span>`;
    document.body.appendChild(filterButton);
    // Load SVG for filter button
    loadSVG(filterButton.querySelector('.svg-filter-toggle'), 'svg/filter-toggle.svg');

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

    // URL Management Functions
    const updateURL = (filters) => {
        const url = new URL(window.location);
        const params = new URLSearchParams();
        
        // Add non-empty filters to URL
        if (filters.city) params.set('city', filters.city);
        if (filters.reader) params.set('reader', filters.reader);
        if (filters.matam) params.set('matam', filters.matam);
        if (filters.time) params.set('time', filters.time);
        
        // Update URL without page reload
        const newUrl = params.toString() ? `${url.pathname}?${params.toString()}` : url.pathname;
        window.history.pushState({}, '', newUrl);
    };

    const getFiltersFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            city: params.get('city') || '',
            reader: params.get('reader') || '',
            matam: params.get('matam') || '',
            time: params.get('time') || ''
        };
    };

    const applyFiltersFromURL = () => {
        const filters = getFiltersFromURL();
        
        // Set filter values without triggering events
        cityFilter.value = filters.city;
        readerFilter.value = filters.reader;
        matamFilter.value = filters.matam;
        timeFilter.value = filters.time;
        
        // Apply the filters
        applyFiltersInternal();
    };

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        applyFiltersFromURL();
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
                    <p class="text-xl text-red-600 font-semibold mb-1">🏘️ ${item.city}</p>
                    <div class="flex items-center justify-between">
                        <h3 class="font-bold text-xl text-gray-300 mb-3">🕌 ${item.matam}</h3>
                        <button class="filter-icon cursor-pointer p-1 rounded-full hover:bg-gray-100" onclick="filterByMatam('${item.matam}')" title="فلترة حسب هذا المأتم">
                            <span class="svg-filter-matam"></span>
                        </button>
                    </div>
                    <div class="space-y-3 text-gray-300">
                        <div class="flex items-center justify-between">
                            <p class="flex items-center flex-grow">
                                <span class="svg-person w-5 h-5 ml-2 text-gray-400"></span>
                                <span class="font-semibold text-xl">القارئ:</span>&nbsp;<span>${item.reader}</span>
                            </p>
                            <button class="filter-icon cursor-pointer p-1 rounded-full hover:bg-gray-100" onclick="filterByReader('${item.reader}')" title="فلترة حسب هذا القارئ">
                                <span class="svg-filter-reader"></span>
                            </button>
                        </div>
                        <p class="flex items-center text-xl">
                             <span class="svg-clock w-5 h-5 ml-2 text-gray-400"></span>
                            <span class="font-semibold">الوقت:</span>&nbsp;<span>${item.time}</span>
                        </p>
                    </div>
                </div>
                <div class="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-end space-x-2 space-x-reverse">
                    ${item.instagram ? `
                    <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-md hover:opacity-90 transition-opacity text-sm">
                        <span class="svg-instagram w-4 h-4"></span>
                    </a>
                    ` : ''}
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
                        <span class="svg-location w-4 h-4"></span>
                    </a>
                </div>
            `;
            fragment.appendChild(card);

            // After card is in DOM, load SVGs
            setTimeout(() => {
                loadSVG(card.querySelector('.svg-filter-matam'), 'svg/filter-matam.svg', 'w-5 h-5 text-gray-500');
                loadSVG(card.querySelector('.svg-person'), 'svg/person.svg', 'w-5 h-5 ml-2 text-gray-400');
                loadSVG(card.querySelector('.svg-filter-reader'), 'svg/filter-reader.svg', 'w-5 h-5 text-gray-500');
                loadSVG(card.querySelector('.svg-clock'), 'svg/clock.svg', 'w-5 h-5 ml-2 text-gray-400');
                if (item.instagram) loadSVG(card.querySelector('.svg-instagram'), 'svg/instagram.svg', 'w-4 h-4');
                loadSVG(card.querySelector('.svg-location'), 'svg/location.svg', 'w-4 h-4');
            }, 0);
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

    // Internal function to apply filters without updating URL
    const applyFiltersInternal = () => {
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
    };

    // Main function to apply filters and update URL
    const applyFilters = debounce(() => {
        const filters = {
            city: cityFilter.value,
            reader: readerFilter.value,
            matam: matamFilter.value,
            time: timeFilter.value
        };

        // Update URL with current filters
        updateURL(filters);
        
        // Apply the filters
        applyFiltersInternal();
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
        
        // Clear URL parameters
        window.history.pushState({}, '', window.location.pathname);
        
        applyFiltersInternal();
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
    
    // Check if there are URL parameters on page load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString()) {
        // Apply filters from URL
        applyFiltersFromURL();
    } else {
        // No URL filters, show all results
        renderResults(majalisData);
    }

    // At the end of DOMContentLoaded, load static SVGs
    loadStaticSVGs();
});