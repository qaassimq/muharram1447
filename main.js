document.addEventListener('DOMContentLoaded', () => {
    const svgCache = new Map();

    // Utility to load SVG from file and inject into element
    function loadSVG(element, svgPath, classList = '') {
        if (!element) return;

        const applySvgToElement = (svgText) => {
            element.innerHTML = svgText;
            if (classList) {
                const svgEl = element.querySelector('svg');
                if (svgEl) svgEl.setAttribute('class', classList);
            }
        };

        if (svgCache.has(svgPath)) {
            applySvgToElement(svgCache.get(svgPath));
            return;
        }

        fetch(svgPath)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch SVG: ${res.statusText}`);
                }
                return res.text();
            })
            .then(svg => {
                svgCache.set(svgPath, svg);
                applySvgToElement(svg);
            })
            .catch(error => console.error(`Error loading SVG from ${svgPath}:`, error));
    }

    // Load all static SVGs in the DOM (header, filter button, no-results)
    function loadStaticSVGs() {
        loadSVG(document.querySelector('.svg-filter-toggle'), 'svg/filter-toggle.svg', 'h-6 w-6');
        const filterToggleBtn = document.getElementById('filter-toggle');
        if (filterToggleBtn) {
            loadSVG(filterToggleBtn.querySelector('.svg-filter-toggle'), 'svg/filter-toggle.svg', 'h-6 w-6');
        }
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
    const currentTimeFilter = document.getElementById('current-time-filter');
    const themeToggle = document.getElementById('theme-toggle'); 220
    const sortFilter = document.getElementById('sort-filter');

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

        if (filters.city) params.set('city', filters.city);
        if (filters.reader) params.set('reader', filters.reader);
        if (filters.matam) params.set('matam', filters.matam);
        if (filters.time) params.set('time', filters.time);
        if (filters.currentTime) params.set('currentTime', filters.currentTime);
        if (filters.sort) params.set('sort', filters.sort);


        const newUrl = params.toString() ? `${url.pathname}?${params.toString()}` : url.pathname;
        window.history.pushState({}, '', newUrl);
    };

    const getFiltersFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            city: params.get('city') || '',
            reader: params.get('reader') || '',
            matam: params.get('matam') || '',
            time: params.get('time') || '',
            currentTime: params.get('currentTime') || '',
            sort: params.get('sort') || ''
        };
    };

    const applyFiltersFromURL = () => {
        const filters = getFiltersFromURL();

        cityFilter.value = filters.city;
        readerFilter.value = filters.reader;
        matamFilter.value = filters.matam;
        timeFilter.value = filters.time;
        currentTimeFilter.value = filters.currentTime;
        sortFilter.value = filters.sort;


        applyFiltersInternal();
    };

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        applyFiltersFromURL();
    });

    // Performance optimization - Create document fragment for batch DOM updates
    const createCardFragment = (data) => {
        const fragment = document.createDocumentFragment();

        // Pre-load all SVGs needed for cards
        const svgPromises = [
            'svg/filter-matam.svg',
            'svg/person.svg',
            'svg/filter-reader.svg',
            'svg/clock.svg',
            'svg/instagram.svg',
            'svg/location.svg'
        ].map(path => {
            if (!svgCache.has(path)) {
                return fetch(path)
                    .then(res => res.text())
                    .then(svg => svgCache.set(path, svg))
                    .catch(error => console.error(`Error loading SVG from ${path}:`, error));
            }
            return Promise.resolve();
        });

        Promise.all(svgPromises).then(() => {
            data.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col card-enter relative';
                card.style.animationDelay = `${Math.min(index * 30, 300)}ms`;

                const locationQuery = encodeURIComponent(`${item.matam}, ${item.city}, Bahrain`);
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
                const instagramUrl = item.instagram || `https://www.instagram.com/yowahedona`;

                // Get SVGs from cache
                const filterMatamSvg = svgCache.get('svg/filter-matam.svg') || '';
                const personSvg = svgCache.get('svg/person.svg') || '';
                const filterReaderSvg = svgCache.get('svg/filter-reader.svg') || '';
                const clockSvg = svgCache.get('svg/clock.svg') || '';
                const instagramSvg = svgCache.get('svg/instagram.svg') || '';
                const locationSvg = svgCache.get('svg/location.svg') || '';

                card.innerHTML = `
                <div class="p-5 flex-grow">
                    <p class="text-xl text-red-600 font-semibold mb-1">🏘️ ${item.city}</p>
                    <div class="flex items-center justify-between">
                        <h3 class="font-bold text-xl text-gray-800 dark:text-gray-200 mb-3">🕌 ${item.matam}</h3>
                        <button class="filter-icon cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onclick="filterByMatam('${item.matam}')" title="فلترة حسب هذا المأتم">
                            ${filterMatamSvg}
                        </button>
                    </div>
                    <div class="space-y-3 text-gray-800 dark:text-gray-200">
                        <div class="flex items-center justify-between">
                            <p class="flex items-center flex-grow">
                                ${personSvg}
                                <span class="font-semibold text-xl">القارئ:</span>&nbsp;<span>${item.reader}</span>
                            </p>
                            <button class="filter-icon cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onclick="filterByReader('${item.reader}')" title="فلترة حسب هذا القارئ">
                                ${filterReaderSvg}
                            </button>
                        </div>
                        <p class="flex items-center text-xl">
                            ${clockSvg}
                            <span class="font-semibold">الوقت:</span>&nbsp;<span>${item.time}</span>
                        </p>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3 border-t border-gray-100 dark:border-gray-600 flex items-center justify-end space-x-2 space-x-reverse">
                    ${item.instagram ? `
                    <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-md hover:opacity-90 transition-opacity text-sm">
                        ${instagramSvg}
                    </a>
                    ` : ''}
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
                        ${locationSvg}
                    </a>
                </div>
            `;
                fragment.appendChild(card);
            });

            if (resultsGrid) {
                resultsGrid.innerHTML = '';
                resultsGrid.appendChild(fragment);
            }
        });

        return fragment;
    };
    const sortByTime = (data, sortType) => {
        if (!sortType) return data;

        return [...data].sort((a, b) => {
            const timeA = parseTimeString(a.time);
            const timeB = parseTimeString(b.time);

            // Handle cases where time parsing fails
            if (!timeA && !timeB) return 0;
            if (!timeA) return 1;
            if (!timeB) return -1;

            const minutesA = timeA.hours * 60 + timeA.minutes;
            const minutesB = timeB.hours * 60 + timeB.minutes;

            if (sortType === 'time-asc') {
                return minutesA - minutesB;
            } else if (sortType === 'time-desc') {
                return minutesB - minutesA;
            }

            return 0;
        });
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
        return function (...args) {
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
        const currentTime = currentTimeFilter.value;
        const sort = sortFilter.value;

        const filteredData = majalisData.filter(item => {
            const cityMatch = !city || item.city === city;
            const readerMatch = !reader || item.reader.toLowerCase().includes(reader);
            const matamMatch = !matam || item.matam.toLowerCase().includes(matam);
            const timeMatch = !time || getTimeCategory(item.time) === time;
            const currentTimeMatch = !currentTime || currentTime !== 'upcoming' || isUpcoming(item.time);

            return cityMatch && readerMatch && matamMatch && timeMatch && currentTimeMatch;
        });

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
            time: timeFilter.value,
            currentTime: currentTimeFilter.value,
            sort: sortFilter.value
        };

        updateURL(filters);
        applyFiltersInternal();
    }, 200);// 200ms debounce for smoother filtering

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
        currentTimeFilter.value = '';
        sortFilter.value = '';

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
        currentTimeFilter.removeEventListener('change', applyFilters);
        sortFilter.removeEventListener('change', applyFilters);

        // For desktop: apply filters immediately
        if (window.innerWidth >= 768) {
            cityFilter.addEventListener('change', applyFilters);
            readerFilter.addEventListener('input', applyFilters);
            matamFilter.addEventListener('input', applyFilters);
            timeFilter.addEventListener('change', applyFilters);
            currentTimeFilter.addEventListener('change', applyFilters);
            sortFilter.addEventListener('change', applyFilters);
        }
    };


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

    // Add theme toggle functionality
    const initTheme = () => {
        // Dark mode is default, but check localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
        updateThemeIcon();
    };

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeIcon();
    };

    const updateThemeIcon = () => {
        const isDark = document.documentElement.classList.contains('dark');
        const iconPath = isDark ? 'svg/sun.svg' : 'svg/moon.svg';
        loadSVG(document.getElementById('theme-icon'), iconPath, 'w-5 h-5');
    };

    // Add current time filtering functionality
    const parseTimeString = (timeString) => {
        if (!timeString) return null;

        // Extract time and period
        const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(صباحًا|صباحاً|ظهراً|عصراً|عصرًا|مساءً|مساءا)/);
        if (!timeMatch) return null;

        let [, hours, minutes, period] = timeMatch;
        hours = parseInt(hours);
        minutes = parseInt(minutes);

        // Convert to 24-hour format
        if (period.includes('صباح')) {
            // Morning: 6 AM - 11:59 AM
            if (hours === 12) hours = 0;
        } else if (period.includes('ظهراً')) {
            // Noon: 12 PM - 2:59 PM
            if (hours !== 12) hours += 12;
        } else if (period.includes('عصر')) {
            // Afternoon: 3 PM - 5:59 PM
            hours += 12;
        } else if (period.includes('مساء')) {
            // Evening: 6 PM - 11:59 PM
            if (hours !== 12) hours += 12;
        }

        return { hours, minutes };
    };

    const isUpcoming = (timeString) => {
        const parsedTime = parseTimeString(timeString);
        if (!parsedTime) return false;

        const now = new Date();
        const eventTime = new Date();
        eventTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);

        return eventTime > now;
    };
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize theme on page load - add this before loadStaticSVGs()
    initTheme();
});

document.addEventListener('DOMContentLoaded', function () {
    const filtersSection = document.getElementById('filters-section');
    const filterToggle = document.getElementById('filter-toggle');
    const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
    const closeFilters = document.getElementById('close-filters');

    function openFilters() {
        filtersSection.classList.remove('filters-hidden');
        filtersSection.classList.add('filters-appear');
    }

    function closeFiltersPanel() {
        filtersSection.classList.remove('filters-appear');
        filtersSection.classList.add('filters-hidden');
    }

    // Open filter panel on mobile
    if (mobileFilterToggle) {
        mobileFilterToggle.addEventListener('click', openFilters);
    }
    if (filterToggle) {
        filterToggle.addEventListener('click', openFilters);
    }
    // Close filter panel on mobile
    if (closeFilters) {
        closeFilters.addEventListener('click', closeFiltersPanel);
    }
});