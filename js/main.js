// Main JavaScript File - Core Functionality

class DealHuntApp {
    constructor() {
        this.deals = [];
        this.filteredDeals = [];
        this.currentFilters = {
            category: '',
            discount: '',
            priceRange: '',
            search: '',
            sortBy: 'newest'
        };
        this.currentPage = 1;
        this.dealsPerPage = 12;
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        // Initialize app
        this.showLoadingSpinner();
        await this.loadDeals();
        this.setupEventListeners();
        this.setupCountdownTimer();
        this.hideLoadingSpinner();
        this.renderDeals();
        this.updateStats();
    }

    // Loading and Data Management
    async loadDeals() {
        try {
            // In a real app, this would be an API call
            const response = await fetch('data/deals.json');
            if (!response.ok) {
                throw new Error('Failed to load deals');
            }
            this.deals = await response.json();
            this.filteredDeals = [...this.deals];
        } catch (error) {
            console.error('Error loading deals:', error);
            // Load mock data if file not found
            this.deals = this.getMockDeals();
            this.filteredDeals = [...this.deals];
        }
    }

    getMockDeals() {
        return [
            {
                id: 1,
                title: "Wireless Bluetooth Headphones - Premium Sound Quality",
                category: "electronics",
                originalPrice: 129.99,
                currentPrice: 39.99,
                discountPercentage: 69,
                savings: 90.00,
                imageUrl: "https://via.placeholder.com/400x250/2563eb/ffffff?text=Headphones",
                amazonUrl: "https://amazon.com/dp/example1",
                rating: 4.5,
                reviewCount: 2847,
                dealScore: 92,
                isVerified: true,
                expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                commission: 2.40
            },
            {
                id: 2,
                title: "Smart Home Security Camera System with Night Vision",
                category: "home",
                originalPrice: 199.99,
                currentPrice: 79.99,
                discountPercentage: 60,
                savings: 120.00,
                imageUrl: "https://via.placeholder.com/400x250/10b981/ffffff?text=Security+Camera",
                amazonUrl: "https://amazon.com/dp/example2",
                rating: 4.3,
                reviewCount: 1256,
                dealScore: 87,
                isVerified: true,
                expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
                commission: 4.80
            },
            {
                id: 3,
                title: "Premium Kitchen Knife Set - Professional Grade Stainless Steel",
                category: "home",
                originalPrice: 89.99,
                currentPrice: 29.99,
                discountPercentage: 67,
                savings: 60.00,
                imageUrl: "https://via.placeholder.com/400x250/f59e0b/ffffff?text=Knife+Set",
                amazonUrl: "https://amazon.com/dp/example3",
                rating: 4.7,
                reviewCount: 892,
                dealScore: 94,
                isVerified: true,
                expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 30 * 60 * 1000),
                commission: 1.80
            }
        ];
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Search
        const searchInput = document.getElementById('deal-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300));
        }

        // Filters
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        const discountFilter = document.getElementById('discount-filter');
        if (discountFilter) {
            discountFilter.addEventListener('change', (e) => {
                this.currentFilters.discount = e.target.value;
                this.applyFilters();
            });
        }

        const priceFilter = document.getElementById('price-filter');
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.currentFilters.priceRange = e.target.value;
                this.applyFilters();
            });
        }

        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Clear filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Load more deals
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreDeals();
            });
        }

        // Category cards
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Auth modals
        this.setupAuthModals();

        // Newsletter
        this.setupNewsletter();

        // Hero CTA
        const heroCTA = document.getElementById('hero-cta');
        if (heroCTA) {
            heroCTA.addEventListener('click', () => {
                document.getElementById('deals').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    setupNavigation() {
        // Mobile menu toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Close mobile menu
                    if (navMenu) navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                }
            });
        });
    }

    setupAuthModals() {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        const showSignupLink = document.getElementById('show-signup');
        const showLoginLink = document.getElementById('show-login');

        // Show modals
        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', () => {
                loginModal.style.display = 'block';
            });
        }

        if (signupBtn && signupModal) {
            signupBtn.addEventListener('click', () => {
                signupModal.style.display = 'block';
            });
        }

        // Switch between modals
        if (showSignupLink && signupModal && loginModal) {
            showSignupLink.addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.style.display = 'none';
                signupModal.style.display = 'block';
            });
        }

        if (showLoginLink && loginModal && signupModal) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                signupModal.style.display = 'none';
                loginModal.style.display = 'block';
            });
        }

        // Close modals
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Handle form submissions
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(new FormData(loginForm));
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(new FormData(signupForm));
            });
        }
    }

    setupNewsletter() {
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                this.handleNewsletterSignup(email);
            });
        }
    }

    // Countdown Timer
    setupCountdownTimer() {
        const updateCountdown = () => {
            const now = new Date();
            const nextUpdate = new Date();
            const currentHour = now.getHours();
            
            // Calculate next update time (9 AM, 1 PM, 6 PM, 9 PM)
            const updateTimes = [9, 13, 18, 21];
            let nextUpdateHour = updateTimes.find(time => time > currentHour);
            
            if (!nextUpdateHour) {
                // Next update is tomorrow at 9 AM
                nextUpdate.setDate(nextUpdate.getDate() + 1);
                nextUpdate.setHours(9, 0, 0, 0);
            } else {
                nextUpdate.setHours(nextUpdateHour, 0, 0, 0);
            }

            const timeLeft = nextUpdate - now;
            
            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');

                if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Filtering and Sorting
    applyFilters() {
        this.filteredDeals = this.deals.filter(deal => {
            // Category filter
            if (this.currentFilters.category && deal.category !== this.currentFilters.category) {
                return false;
            }

            // Discount filter
            if (this.currentFilters.discount && deal.discountPercentage < parseInt(this.currentFilters.discount)) {
                return false;
            }

            // Price range filter
            if (this.currentFilters.priceRange) {
                const [min, max] = this.currentFilters.priceRange.split('-').map(Number);
                if (deal.currentPrice < min || (max && deal.currentPrice > max)) {
                    return false;
                }
            }

            // Search filter
            if (this.currentFilters.search && !deal.title.toLowerCase().includes(this.currentFilters.search)) {
                return false;
            }

            return true;
        });

        // Sort deals
        this.sortDeals();
        this.currentPage = 1;
        this.renderDeals();
        this.updateActiveFilters();
    }

    sortDeals() {
        this.filteredDeals.sort((a, b) => {
            switch (this.currentFilters.sortBy) {
                case 'discount':
                    return b.discountPercentage - a.discountPercentage;
                case 'price-low':
                    return a.currentPrice - b.currentPrice;
                case 'price-high':
                    return b.currentPrice - a.currentPrice;
                case 'popular':
                    return b.reviewCount - a.reviewCount;
                case 'newest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
    }

    clearAllFilters() {
        this.currentFilters = {
            category: '',
            discount: '',
            priceRange: '',
            search: '',
            sortBy: 'newest'
        };

        // Reset form elements
        const searchInput = document.getElementById('deal-search');
        const categoryFilter = document.getElementById('category-filter');
        const discountFilter = document.getElementById('discount-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (discountFilter) discountFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (sortFilter) sortFilter.value = 'newest';

        this.applyFilters();
    }

    filterByCategory(category) {
        this.currentFilters.category = category;
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = category;
        }
        this.applyFilters();
        document.getElementById('deals').scrollIntoView({ behavior: 'smooth' });
    }

    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        if (!activeFiltersContainer) return;

        activeFiltersContainer.innerHTML = '';

        Object.entries(this.currentFilters).forEach(([key, value]) => {
            if (value && key !== 'sortBy') {
                const filterTag = document.createElement('div');
                filterTag.className = 'filter-tag';
                
                let displayText = '';
                switch (key) {
                    case 'category':
                        displayText = `Category: ${this.capitalizeFirst(value)}`;
                        break;
                    case 'discount':
                        displayText = `Min Discount: ${value}%+`;
                        break;
                    case 'priceRange':
                        displayText = `Price: $${value.replace('-', ' - $')}`;
                        break;
                    case 'search':
                        displayText = `Search: "${value}"`;
                        break;
                }

                filterTag.innerHTML = `
                    ${displayText}
                    <button onclick="app.removeFilter('${key}')">×</button>
                `;
                
                activeFiltersContainer.appendChild(filterTag);
            }
        });
    }

    removeFilter(filterKey) {
        this.currentFilters[filterKey] = '';
        
        // Reset corresponding form element
        const elementMap = {
            category: 'category-filter',
            discount: 'discount-filter',
            priceRange: 'price-filter',
            search: 'deal-search'
        };

        const element = document.getElementById(elementMap[filterKey]);
        if (element) {
            element.value = '';
        }

        this.applyFilters();
    }

    // Deal Rendering
    renderDeals() {
        const dealsGrid = document.getElementById('deals-grid');
        const noDealsMessage = document.getElementById('no-deals');
        const loadMoreBtn = document.getElementById('load-more-btn');

        if (!dealsGrid) return;

        const startIndex = (this.currentPage - 1) * this.dealsPerPage;
        const endIndex = startIndex + this.dealsPerPage;
        const dealsToShow = this.filteredDeals.slice(0, endIndex);

        if (dealsToShow.length === 0) {
            dealsGrid.innerHTML = '';
            if (noDealsMessage) noDealsMessage.style.display = 'block';
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }

        if (noDealsMessage) noDealsMessage.style.display = 'none';

        // Clear grid if it's the first page
        if (this.currentPage === 1) {
            dealsGrid.innerHTML = '';
        }

        // Render new deals
        dealsToShow.slice(startIndex).forEach(deal => {
            const dealCard = this.createDealCard(deal);
            dealsGrid.appendChild(dealCard);
        });

        // Show/hide load more button
        if (loadMoreBtn) {
            loadMoreBtn.style.display = endIndex < this.filteredDeals.length ? 'block' : 'none';
        }

        // Animate new cards
        this.animateNewCards();
    }

    createDealCard(deal) {
        const template = document.getElementById('deal-card-template');
        const card = template.content.cloneNode(true);

        // Populate card data
        card.querySelector('.deal-img').src = deal.imageUrl;
        card.querySelector('.deal-img').alt = deal.title;
        card.querySelector('.discount-badge').textContent = `-${deal.discountPercentage}%`;
        card.querySelector('.deal-title').textContent = deal.title;
        card.querySelector('.original-price').textContent = `$${deal.originalPrice.toFixed(2)}`;
        card.querySelector('.current-price').textContent = `$${deal.currentPrice.toFixed(2)}`;
        card.querySelector('.savings-amount').textContent = `Save $${deal.savings.toFixed(2)}`;
        card.querySelector('.deal-score').textContent = `Score: ${deal.dealScore}`;
        card.querySelector('.deal-rating').innerHTML = this.generateStarRating(deal.rating) + ` (${deal.reviewCount})`;
        
        if (deal.isVerified) {
            card.querySelector('.deal-verified').textContent = 'Verified';
        } else {
            card.querySelector('.deal-verified').style.display = 'none';
        }

        // Deal timer
        const timer = card.querySelector('.deal-timer');
        if (deal.expiresAt) {
            const timeLeft = this.getTimeLeft(deal.expiresAt);
            timer.textContent = `Expires in ${timeLeft}`;
        } else {
            timer.style.display = 'none';
        }

        // Commission disclosure
        card.querySelector('.deal-commission').textContent = `We earn $${deal.commission.toFixed(2)}`;

        // Event listeners
        const getDealBtn = card.querySelector('.deal-btn.primary');
        getDealBtn.addEventListener('click', () => {
            this.handleGetDeal(deal);
        });

        const viewDetailsBtn = card.querySelector('.deal-btn.secondary');
        viewDetailsBtn.addEventListener('click', () => {
            this.showDealDetails(deal);
        });

        const saveBtn = card.querySelector('.save-deal-btn');
        saveBtn.addEventListener('click', () => {
            this.toggleSaveDeal(deal.id, saveBtn);
        });

        // Add deal ID for reference
        const cardElement = card.querySelector('.deal-card');
        cardElement.dataset.dealId = deal.id;

        return card;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return starsHTML;
    }

    getTimeLeft(expiresAt) {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const timeLeft = expiry - now;

        if (timeLeft <= 0) return 'Expired';

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    animateNewCards() {
        const newCards = document.querySelectorAll('.deal-card:not(.animated)');
        newCards.forEach((card, index) => {
            card.classList.add('animated');
            setTimeout(() => {
                card.classList.add('slide-up');
            }, index * 100);
        });
    }

    // Deal Actions
    handleGetDeal(deal) {
        // Track click event
        this.trackEvent('deal_click', { deal_id: deal.id, deal_title: deal.title });
        
        // Show loading state
        this.showToast(`Redirecting to Amazon for "${deal.title}"...`, 'success');
        
        // Open in new tab
        window.open(deal.amazonUrl, '_blank');
    }

    showDealDetails(deal) {
        // Create and show deal details modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>${deal.title}</h2>
                <img src="${deal.imageUrl}" alt="${deal.title}" style="width: 100%; margin: 1rem 0;">
                <div class="deal-pricing">
                    <span class="original-price">$${deal.originalPrice.toFixed(2)}</span>
                    <span class="current-price">$${deal.currentPrice.toFixed(2)}</span>
                    <span class="savings-amount">Save $${deal.savings.toFixed(2)} (${deal.discountPercentage}%)</span>
                </div>
                <p><strong>Deal Score:</strong> ${deal.dealScore}/100</p>
                <p><strong>Rating:</strong> ${this.generateStarRating(deal.rating)} (${deal.reviewCount} reviews)</p>
                <p><strong>Verified Deal:</strong> ${deal.isVerified ? 'Yes' : 'No'}</p>
                <p><strong>Expires:</strong> ${deal.expiresAt ? new Date(deal.expiresAt).toLocaleString() : 'No expiration'}</p>
                <div style="margin-top: 1rem;">
                    <button class="deal-btn primary" onclick="app.handleGetDeal(app.deals.find(d => d.id === ${deal.id}))">Get This Deal</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Close modal event
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    toggleSaveDeal(dealId, button) {
        const isCurrentlySaved = button.classList.contains('saved');
        
        if (isCurrentlySaved) {
            button.classList.remove('saved');
            button.innerHTML = '<i class="far fa-heart"></i>';
            this.showToast('Deal removed from saved list', 'success');
        } else {
            button.classList.add('saved');
            button.innerHTML = '<i class="fas fa-heart"></i>';
            this.showToast('Deal saved successfully!', 'success');
        }

        // Here you would typically save to localStorage or send to server
        this.updateSavedDeals(dealId, !isCurrentlySaved);
    }

    updateSavedDeals(dealId, isSaved) {
        let savedDeals = JSON.parse(localStorage.getItem('savedDeals') || '[]');
        
        if (isSaved) {
            if (!savedDeals.includes(dealId)) {
                savedDeals.push(dealId);
            }
        } else {
            savedDeals = savedDeals.filter(id => id !== dealId);
        }
        
        localStorage.setItem('savedDeals', JSON.stringify(savedDeals));
    }

    loadMoreDeals() {
        this.currentPage++;
        this.renderDeals();
    }

    // Statistics
    updateStats() {
        const activeDealsEl = document.getElementById('active-deals');
        const totalSavingsEl = document.getElementById('total-savings');
        const happyUsersEl = document.getElementById('happy-users');
        const avgDiscountEl = document.getElementById('avg-discount');

        if (activeDealsEl) {
            this.animateNumber(activeDealsEl, this.deals.length);
        }

        if (totalSavingsEl) {
            const totalSavings = this.deals.reduce((sum, deal) => sum + deal.savings, 0) * 100; // Simulate user base
            this.animateNumber(totalSavingsEl, totalSavings, '$', 'M');
        }

        if (happyUsersEl) {
            this.animateNumber(happyUsersEl, 500, '', 'K+');
        }

        if (avgDiscountEl) {
            const avgDiscount = this.deals.reduce((sum, deal) => sum + deal.discountPercentage, 0) / this.deals.length;
            this.animateNumber(avgDiscountEl, Math.round(avgDiscount), '', '%');
        }
    }

    animateNumber(element, target, prefix = '', suffix = '') {
        const start = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (target - start) * this.easeOutQuart(progress));
            
            if (suffix === 'M') {
                element.textContent = `${prefix}${(current / 1000000).toFixed(1)}${suffix}`;
            } else if (suffix === 'K+') {
                element.textContent = `${prefix}${current}${suffix}`;
            } else {
                element.textContent = `${prefix}${current}${suffix}`;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    // Authentication
    handleLogin(formData) {
        const email = formData.get('email');
        const password = formData.get('password');

        // Simulate login process
        this.showToast('Logging in...', 'success');
        
        setTimeout(() => {
            // Close modal
            document.getElementById('login-modal').style.display = 'none';
            this.showToast(`Welcome back! Logged in as ${email}`, 'success');
            
            // Update UI for logged in state
            this.updateAuthUI(true, email);
        }, 1000);
    }

    handleSignup(formData) {
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');

        // Simulate signup process
        this.showToast('Creating your account...', 'success');
        
        setTimeout(() => {
            // Close modal
            document.getElementById('signup-modal').style.display = 'none';
            this.showToast(`Welcome to DealHunt, ${name}!`, 'success');
            
            // Update UI for logged in state
            this.updateAuthUI(true, email);
        }, 1000);
    }

    updateAuthUI(isLoggedIn, email) {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');

        if (isLoggedIn && loginBtn && signupBtn) {
            loginBtn.textContent = email.split('@')[0];
            loginBtn.onclick = () => this.handleLogout();
            signupBtn.style.display = 'none';
        }
    }

    handleLogout() {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');

        if (loginBtn && signupBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.onclick = null;
            signupBtn.style.display = 'inline-block';
        }

        this.showToast('Logged out successfully', 'success');
    }

    // Newsletter
    handleNewsletterSignup(email) {
        this.showToast('Subscribing...', 'success');
        
        setTimeout(() => {
            const successMessage = document.getElementById('newsletter-success');
            const form = document.getElementById('newsletter-form');
            
            if (successMessage && form) {
                form.style.display = 'none';
                successMessage.style.display = 'flex';
            }
            
            this.showToast('Successfully subscribed to deal alerts!', 'success');
        }, 1000);
    }

    // Utility Functions
    showLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) spinner.style.display = 'flex';
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 500);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';

        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                toast.style.display = 'none';
            };
        }
    }

    trackEvent(eventName, properties) {
        // Analytics tracking
        console.log('Event tracked:', eventName, properties);
        
        // Here you would integrate with analytics services like:
        // - Google Analytics
        // - Mixpanel
        // - Amplitude
        // gtag('event', eventName, properties);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DealHuntApp();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DealHuntApp;
}
