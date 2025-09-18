const products = [
    {
        id: "1",
        name: "Apple iPhone 15 Pro Max (256GB) - Natural Titanium",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        originalPrice: 159900,
        salePrice: 144900,
        discount: 15000,
        rating: 4.5,
        reviews: 2847,
        amazonUrl: "https://amazon.in/dp/B0CHX1W1XY",
        badge: "🔥 TRENDING"
    },
    {
        id: "2", 
        name: "Sony WH-1000XM4 Wireless Industry Leading Noise Canceling Overhead Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        originalPrice: 29990,
        salePrice: 18990,
        discount: 11000,
        rating: 4.4,
        reviews: 1523,
        amazonUrl: "https://amazon.in/dp/B0863TXGM3",
        badge: "⚡ DEAL OF DAY"
    },
    {
        id: "3",
        name: "Samsung 65 inches Neo QLED 4K Smart TV QN90A Series",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        originalPrice: 199900,
        salePrice: 149900,
        discount: 50000,
        rating: 4.3,
        reviews: 892,
        amazonUrl: "https://amazon.in/dp/B08W2682Q7",
        badge: "💎 PREMIUM"
    },
    {
        id: "4",
        name: "Apple iPhone 15 (128GB) - Pink",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
        originalPrice: 79900,
        salePrice: 69900,
        discount: 10000,
        rating: 4.6,
        reviews: 3241,
        amazonUrl: "https://amazon.in/dp/B0CHX69VFQ"
    },
    {
        id: "5",
        name: "Sony WH-CH720N Wireless Noise Canceling Headphones",
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        originalPrice: 14990,
        salePrice: 9990,
        discount: 5000,
        rating: 4.2,
        reviews: 756,
        amazonUrl: "https://amazon.in/dp/B0BZZ7X4R3",
        badge: "🎯 BEST SELLER"
    },
    {
        id: "6",
        name: "Samsung 55 inches Crystal 4K Vivid Pro Ultra HD Smart LED TV",
        image: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80",
        originalPrice: 62900,
        salePrice: 39900,
        discount: 23000,
        rating: 4.1,
        reviews: 1347,
        amazonUrl: "https://amazon.in/dp/B0BVXF72F4"
    },
];

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN').format(price);
}

function calculateDiscountPercentage(original, sale) {
    return Math.round(((original - sale) / original) * 100);
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">⭐</span>';
    }
    
    if (hasHalfStar) {
        stars += '<span class="star">⭐</span>';
    }
    
    return stars;
}

// Product card generation
function createProductCard(product) {
    const discountPercentage = calculateDiscountPercentage(product.originalPrice, product.salePrice);
    
    return `
        <div class="product-card" onclick="openAmazonLink('${product.amazonUrl}')">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                
                ${discountPercentage > 0 ? `<div class="discount-badge">${discountPercentage}% OFF</div>` : ''}
                
                ${product.badge ? `<div class="special-badge">${product.badge}</div>` : ''}
                
                <button class="wishlist-btn" onclick="toggleWishlist(event, '${product.id}')" title="Add to Wishlist">
                    ❤️
                </button>
            </div>

            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>

                <div class="product-rating">
                    <div class="rating-stars">
                        ${generateStars(product.rating)}
                        <span class="rating-number">${product.rating}</span>
                    </div>
                    <span class="rating-reviews">(${formatPrice(product.reviews)} reviews)</span>
                </div>

                <div class="product-pricing">
                    <div class="price-row">
                        <span class="sale-price">₹${formatPrice(product.salePrice)}</span>
                        ${product.originalPrice > product.salePrice ? 
                            `<span class="original-price">₹${formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                    ${product.originalPrice > product.salePrice ? 
                        `<div class="savings">You save ₹${formatPrice(product.originalPrice - product.salePrice)}</div>` : ''}
                </div>

                <div class="product-actions">
                    <button class="buy-btn" onclick="openAmazonLink('${product.amazonUrl}')">
                        🔗 Buy on Amazon
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Event handlers
function openAmazonLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

function toggleWishlist(event, productId) {
    event.stopPropagation();
    
    // Get current wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (wishlist.includes(productId)) {
        // Remove from wishlist
        wishlist = wishlist.filter(id => id !== productId);
        event.target.style.opacity = '0.5';
        showNotification('Removed from wishlist', 'success');
    } else {
        // Add to wishlist
        wishlist.push(productId);
        event.target.style.opacity = '1';
        event.target.style.color = '#ef4444';
        showNotification('Added to wishlist', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: var(--primary-foreground);
        padding: 1rem;
        border-radius: var(--radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Update wishlist states
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist.forEach(productId => {
        const wishlistBtn = document.querySelector(`button[onclick*="${productId}"]`);
        if (wishlistBtn) {
            wishlistBtn.style.opacity = '1';
            wishlistBtn.style.color = '#ef4444';
        }
    });
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length === 0) {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );
    
    const productGrid = document.getElementById('product-grid');
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <h3>No products found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
    } else {
        productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}

function debounce(func, wait) {
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

function closeNotificationBar() {
    const notificationBar = document.getElementById('deals-notification-bar');
    if (notificationBar) {
        notificationBar.style.display = 'none';
    }
}

function handleLoadMore() {
    // Simulate loading more products
    showNotification('Loading more deals...', 'info');
    
    // In a real application, you would fetch more products from an API
    setTimeout(() => {
        showNotification('More deals loaded!', 'success');
    }, 1000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load products
    loadProducts();
    
    // Initialize search
    initializeSearch();
    
    // Close notification bar handler
    const closeBtn = document.getElementById('close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNotificationBar);
    }
    
    // Load more button handler
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }
    
    // Category cards click handlers
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('.category-name').textContent;
            showNotification(`Browsing ${categoryName} category`, 'info');
        });
    });
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent;
            showNotification(`Browsing ${category} section`, 'info');
        });
    });
    
    // Hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            if (buttonText.includes('Shop Now')) {
                showNotification('Redirecting to deals section', 'info');
                document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
            } else if (buttonText.includes('Today\'s Deals')) {
                showNotification('Loading today\'s special deals', 'info');
            }
        });
    });
    
    // Add smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
