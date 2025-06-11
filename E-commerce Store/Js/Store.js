//=======================//
//     Loading page
//======================//

window.addEventListener("load", function () {
    // Select elements
    const loader = document.querySelector(".loader");
    const storePage = document.querySelector(".store-page");

    // Fade out loader
    loader.style.opacity = "0";

    // After fade out, hide loader and show store page
    setTimeout(() => {
        loader.style.display = "none";
        storePage.style.display = "block";
    }, 800); // Matches fade time
});



// Store functionality with cart and wishlist integration
let cart = [];
let wishlist = [];
let products = [];

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load cart and wishlist from localStorage
    loadCart();
    loadWishlist();
    
    // Initialize store
    initializeStore();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load products
    loadProducts();
    
    // Remove loader after content loads
    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
    }, 1500);
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('nikeCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartBadge();
}

// Load wishlist from localStorage
function loadWishlist() {
    const savedWishlist = localStorage.getItem('nikeWishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
    updateWishlistBadge();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('nikeCart', JSON.stringify(cart));
    updateCartBadge();
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('nikeWishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
}

// Initialize store
function initializeStore() {
    // Initialize product data
    products = [
        {
            id: 'nike-air-max-270-1',
            name: 'Nike Air Max 270',
            category: "Men's Shoes",
            price: 2500,
            image: '/Photo/Prodect-1.png',
            colors: ['#000', '#fff', '#d43f21'],
            sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
            badge: 'new'
        },
        {
            id: 'nike-react-infinity-1',
            name: 'Nike React Infinity Run',
            category: "Women's Running Shoes",
            price: 4160,
            originalPrice: 7520,
            discount: 25,
            image: '/Photo/Prodect-2.png',
            colors: ['#e91e63', '#9c27b0'],
            sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9'],
            badge: 'sale'
        },
        {
            id: 'nike-blazer-mid-1',
            name: "Nike Blazer Mid '77",
            category: 'Lifestyle Shoes',
            price: 8500,
            image: '/Photo/Prodect-3.png',
            colors: ['#fff', '#3498db', '#2ecc71'],
            sizes: ['7', '8', '9', '10', '11', '12'],
            badge: 'hot'
        }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Cart button
    document.querySelector('.cart-btn').addEventListener('click', () => {
        window.location.href = '../HTML/cart.html';
    });
    
    // Wishlist button
    document.querySelector('.wishlist-btn').addEventListener('click', () => {
        window.location.href = '../HTML/wishlist.html';
    });
    
    // Quick add buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quick-add')) {
            const productCard = e.target.closest('.product-card');
            const productIndex = Array.from(document.querySelectorAll('.product-card')).indexOf(productCard);
            handleQuickAdd(productIndex);
        }
        
        // Wishlist toggle
        if (e.target.closest('.wishlist-toggle')) {
            const productCard = e.target.closest('.product-card');
            const productIndex = Array.from(document.querySelectorAll('.product-card')).indexOf(productCard);
            handleWishlistToggle(productIndex);
        }
    });
    
    // Filter toggle
    document.querySelector('.filter-toggle').addEventListener('click', toggleFilters);
    
    // Sort select
    document.querySelector('.sort-select').addEventListener('change', handleSort);
    
    // Filter options
    setupFilterListeners();
    
    // Load more button
    document.querySelector('.load-more-btn').addEventListener('click', loadMoreProducts);
}

// Handle quick add to cart
function handleQuickAdd(productIndex) {
    const product = products[productIndex];
    
    if (!product) return;
    
    // Create cart item with default selections
    const cartItem = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        size: product.sizes[Math.floor(product.sizes.length / 2)], // Default to middle size
        color: product.colors[0], // Default to first color
        quantity: 1
    };
    
    // Check if item already exists in cart
    const existingIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size && 
        item.color === cartItem.color
    );
    
    if (existingIndex > -1) {
        // Increase quantity
        cart[existingIndex].quantity += 1;
        showToast(`${product.name} quantity updated in cart`, 'success');
    } else {
        // Add new item
        cart.push(cartItem);
        showToast(`${product.name} added to cart`, 'success');
    }
    
    // Save cart
    saveCart();
    
    // Animate button
    animateQuickAdd(productIndex);
}

// Handle wishlist toggle
function handleWishlistToggle(productIndex) {
    const product = products[productIndex];
    
    if (!product) return;
    
    // Check if item exists in wishlist
    const existingIndex = wishlist.findIndex(item => item.id === product.id);
    
    const wishlistBtn = document.querySelectorAll('.wishlist-toggle')[productIndex];
    const icon = wishlistBtn.querySelector('i');
    
    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        icon.classList.remove('fas');
        icon.classList.add('far');
        wishlistBtn.classList.remove('active');
        showToast(`${product.name} removed from wishlist`, 'info');
    } else {
        // Add to wishlist
        const wishlistItem = {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            size: product.sizes[Math.floor(product.sizes.length / 2)],
            color: product.colors[0]
        };
        
        wishlist.push(wishlistItem);
        icon.classList.remove('far');
        icon.classList.add('fas');
        wishlistBtn.classList.add('active');
        showToast(`${product.name} added to wishlist`, 'success');
    }
    
    // Save wishlist
    saveWishlist();
    
    // Animate icon
    animateWishlistIcon(wishlistBtn);
}

// Update cart badge
function updateCartBadge() {
    const badge = document.querySelector('.cart-btn .badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
        
        // Animate badge
        if (totalItems > 0) {
            badge.classList.add('bounce');
            setTimeout(() => badge.classList.remove('bounce'), 300);
        }
    }
}

// Update wishlist badge
function updateWishlistBadge() {
    const badge = document.querySelector('.wishlist-btn .badge');
    
    if (badge) {
        badge.textContent = wishlist.length;
        badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
        
        // Animate badge
        if (wishlist.length > 0) {
            badge.classList.add('bounce');
            setTimeout(() => badge.classList.remove('bounce'), 300);
        }
    }
    
    // Update wishlist icons
    updateWishlistIcons();
}

// Update wishlist icons
function updateWishlistIcons() {
    document.querySelectorAll('.product-card').forEach((card, index) => {
        const product = products[index];
        if (product) {
            const wishlistBtn = card.querySelector('.wishlist-toggle');
            const icon = wishlistBtn.querySelector('i');
            
            if (wishlist.some(item => item.id === product.id)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                wishlistBtn.classList.add('active');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                wishlistBtn.classList.remove('active');
            }
        }
    });
}

// Animate quick add button
function animateQuickAdd(productIndex) {
    const button = document.querySelectorAll('.quick-add')[productIndex];
    const originalText = button.textContent;
    
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    button.classList.add('added');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('added');
    }, 1500);
}

// Animate wishlist icon
function animateWishlistIcon(button) {
    button.classList.add('pulse');
    setTimeout(() => button.classList.remove('pulse'), 300);
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'info') icon = 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not exists
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 100px;
                right: 20px;
                background: #000;
                color: #fff;
                padding: 15px 25px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            .toast.error { background: #ff0000; }
            .toast.info { background: #3498db; }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .bounce {
                animation: bounce 0.3s ease;
            }
            
            @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            
            .pulse {
                animation: pulse 0.3s ease;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
            
            .quick-add.added {
                background: #4caf50 !important;
                color: #fff !important;
            }
            
            .wishlist-toggle.active {
                color: #ff0000;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Filter functionality
function toggleFilters() {
    const sidebar = document.querySelector('.filters-sidebar');
    sidebar.classList.toggle('active');
}

function setupFilterListeners() {
    // Category filters
    document.querySelectorAll('.filter-option input').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
       // Price range
    const minSlider = document.querySelector('.slider-min');
    const maxSlider = document.querySelector('.slider-max');
    const minInput = document.querySelector('.min-price');
    const maxInput = document.querySelector('.max-price');
    
    if (minSlider && maxSlider) {
        minSlider.addEventListener('input', updatePriceRange);
        maxSlider.addEventListener('input', updatePriceRange);
        minInput.addEventListener('change', updatePriceSliders);
        maxInput.addEventListener('change', updatePriceSliders);
    }
    
    // Size filters
    document.querySelectorAll('.size-option').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            applyFilters();
        });
    });
    
    // Color filters
    document.querySelectorAll('.color-option').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            applyFilters();
        });
    });
    
    // Clear filters
    document.querySelector('.clear-filters').addEventListener('click', clearAllFilters);
}

// Update price range
function updatePriceRange() {
    const minSlider = document.querySelector('.slider-min');
    const maxSlider = document.querySelector('.slider-max');
    const minInput = document.querySelector('.min-price');
    const maxInput = document.querySelector('.max-price');
    const sliderRange = document.querySelector('.slider-range');
    
    let minVal = parseInt(minSlider.value);
    let maxVal = parseInt(maxSlider.value);
    
    // Prevent crossing
    if (minVal >= maxVal) {
        minSlider.value = maxVal - 10;
        minVal = maxVal - 10;
    }
    
    // Update inputs
    minInput.value = minVal;
    maxInput.value = maxVal;
    
    // Update visual range
    const minPercent = (minVal / 500) * 100;
    const maxPercent = (maxVal / 500) * 100;
    sliderRange.style.left = `${minPercent}%`;
    sliderRange.style.width = `${maxPercent - minPercent}%`;
    
    applyFilters();
}

// Update price sliders from inputs
function updatePriceSliders() {
    const minSlider = document.querySelector('.slider-min');
    const maxSlider = document.querySelector('.slider-max');
    const minInput = document.querySelector('.min-price');
    const maxInput = document.querySelector('.max-price');
    
    minSlider.value = minInput.value;
    maxSlider.value = maxInput.value;
    
    updatePriceRange();
}

// Apply filters
function applyFilters() {
    const activeFilters = {
        categories: [],
        priceMin: parseInt(document.querySelector('.min-price').value),
        priceMax: parseInt(document.querySelector('.max-price').value),
        sizes: [],
        colors: []
    };
    
    // Get active categories
    document.querySelectorAll('.filter-option input:checked').forEach(checkbox => {
        activeFilters.categories.push(checkbox.value);
    });
    
    // Get active sizes
    document.querySelectorAll('.size-option.active').forEach(button => {
        activeFilters.sizes.push(button.textContent);
    });
    
    // Get active colors
    document.querySelectorAll('.color-option.active').forEach(button => {
        activeFilters.colors.push(button.dataset.color);
    });
    
    // Display active filters
    displayActiveFilters(activeFilters);
    
    // Update product count
    updateProductCount(activeFilters);
    
    // In a real app, you would filter the products here
    console.log('Active filters:', activeFilters);
}

// Display active filters
function displayActiveFilters(filters) {
    const container = document.querySelector('.active-filters');
    container.innerHTML = '';
    
    // Categories
    filters.categories.forEach(category => {
        addFilterTag(category, 'category');
    });
    
    // Price range (if not default)
    if (filters.priceMin > 0 || filters.priceMax < 500) {
        addFilterTag(`L.E ${filters.priceMin} - L.E ${filters.priceMax}`, 'price');
    }
    
    // Sizes
    filters.sizes.forEach(size => {
        addFilterTag(`Size ${size}`, 'size');
    });
    
    // Colors
    filters.colors.forEach(color => {
        addFilterTag(color, 'color');
    });
}

// Add filter tag
function addFilterTag(text, type) {
    const container = document.querySelector('.active-filters');
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `
        ${text}
        <button class="remove-filter" data-type="${type}" data-value="${text}">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    tag.querySelector('.remove-filter').addEventListener('click', function() {
        removeFilter(this.dataset.type, this.dataset.value);
    });
    
    container.appendChild(tag);
}

// Remove filter
function removeFilter(type, value) {
    switch(type) {
        case 'category':
            const checkbox = document.querySelector(`input[value="${value}"]`);
            if (checkbox) checkbox.checked = false;
            break;
        case 'size':
            const sizeText = value.replace('Size ', '');
            const sizeButton = Array.from(document.querySelectorAll('.size-option'))
                .find(btn => btn.textContent === sizeText);
            if (sizeButton) sizeButton.classList.remove('active');
            break;
        case 'color':
            const colorButton = document.querySelector(`.color-option[data-color="${value}"]`);
            if (colorButton) colorButton.classList.remove('active');
            break;
    }
    
    applyFilters();
}

// Clear all filters
function clearAllFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('.filter-option input').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset price range
    document.querySelector('.slider-min').value = 0;
    document.querySelector('.slider-max').value = 500;
    document.querySelector('.min-price').value = 0;
    document.querySelector('.max-price').value = 500;
    updatePriceRange();
    
    // Clear size selections
    document.querySelectorAll('.size-option.active').forEach(button => {
        button.classList.remove('active');
    });
    
    // Clear color selections
    document.querySelectorAll('.color-option.active').forEach(button => {
        button.classList.remove('active');
    });
    
    applyFilters();
}

// Update product count
function updateProductCount(filters) {
    // In a real app, this would be based on filtered results
    const count = document.querySelector('.product-count');
    const totalProducts = 324; // This would be dynamic
    count.textContent = `${totalProducts} Products`;
}

// Handle sort
function handleSort(e) {
    const sortValue = e.target.value;
    console.log('Sorting by:', sortValue);
    
    // In a real app, you would sort the products here
    switch(sortValue) {
        case 'featured':
            // Sort by featured
            break;
        case 'newest':
            // Sort by newest
            break;
        case 'price-low':
            // Sort by price low to high
            break;
        case 'price-high':
            // Sort by price high to low
            break;
    }
}

// Load more products
function loadMoreProducts() {
    const button = document.querySelector('.load-more-btn');
    const spinner = button.querySelector('.load-more-spinner');
    const text = button.querySelector('span');
    
    // Show loading state
    text.style.display = 'none';
    spinner.style.display = 'block';
    button.disabled = true;
    
    // Simulate loading
    setTimeout(() => {
        // Add more products
        const grid = document.querySelector('.products-grid');
        const newProducts = generateMoreProducts(6); // Generate 6 more products
        
        newProducts.forEach((product, index) => {
            const productCard = createProductCard(product, index);
            grid.appendChild(productCard);
        });
        
        // Reset button
        text.style.display = 'inline';
        spinner.style.display = 'none';
        button.disabled = false;
        
        // Update count
        updateProductCount({});
        
        // Initialize new product listeners
        initializeNewProducts();
    }, 1500);
}

// Generate more products (simulation)
function generateMoreProducts(count) {
    const newProducts = [];
    for (let i = 0; i < count; i++) {
        newProducts.push({
            id: `nike-product-${Date.now()}-${i}`,
            name: `Nike Product ${products.length + i + 1}`,
            category: ['Men\'s Shoes', 'Women\'s Shoes', 'Lifestyle'][Math.floor(Math.random() * 3)],
            price: Math.floor(Math.random() * 5000) + 2000,
            image: `/Photo/Prodect-${(i % 3) + 1}.png`,
            colors: ['#000', '#fff', '#d43f21'],
            sizes: ['7', '8', '9', '10', '11'],
            badge: ['new', 'sale', 'hot', ''][Math.floor(Math.random() * 4)]
        });
    }
    
    // Add to products array
    products.push(...newProducts);
    
    return newProducts;
}

// Create product card
function createProductCard(product, index) {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.setAttribute('data-aos', 'fade-up');
    article.setAttribute('data-aos-delay', `${(index % 3) * 100}`);
    
    const badgeHTML = product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : '';
    const priceHTML = product.originalPrice ? 
        `<span class="price">L.E ${product.price.toLocaleString()}</span>
         <span class="original-price">L.E ${product.originalPrice.toLocaleString()}</span>` :
        `<span class="price">L.E ${product.price.toLocaleString()}</span>`;
    
    article.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <img src="${product.image}" alt="${product.name}" class="product-img-hover">
            <button class="quick-add">Quick Add +</button>
            <button class="wishlist-toggle"><i class="far fa-heart"></i></button>
            ${badgeHTML}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <div class="product-price">
                ${priceHTML}
            </div>
            <div class="product-colors">
                ${product.colors.map(color => `<span class="color-dot" style="background: ${color}"></span>`).join('')}
            </div>
        </div>
    `;
    
    return article;
}

// Initialize new products
function initializeNewProducts() {
    // Update wishlist icons for new products
    updateWishlistIcons();
    
    // Re-initialize AOS for new products
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Load products (initial load)
function loadProducts() {
    // This would typically fetch from an API
    // For now, products are already initialized
    updateWishlistIcons();
}

// Search functionality
document.querySelector('.search-btn').addEventListener('click', function() {
    // Create search overlay
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <button class="search-close"><i class="fas fa-times"></i></button>
            <div class="search-wrapper">
                <input type="text" class="search-input" placeholder="Search for products...">
                <button class="search-submit"><i class="fas fa-search"></i></button>
            </div>
            <div class="search-suggestions">
                <h4>Popular Searches</h4>
                <div class="suggestion-tags">
                    <span>Air Max</span>
                    <span>Running Shoes</span>
                    <span>Jordan</span>
                    <span>Blazer</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(searchOverlay);
    
    // Focus on input
    setTimeout(() => {
        searchOverlay.classList.add('active');
        searchOverlay.querySelector('.search-input').focus();
    }, 10);
    
    // Close search
    searchOverlay.querySelector('.search-close').addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        setTimeout(() => searchOverlay.remove(), 300);
    });
    
    // Search on enter
    searchOverlay.querySelector('.search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(e.target.value);
        }
    });
    
    // Search button click
    searchOverlay.querySelector('.search-submit').addEventListener('click', () => {
        const query = searchOverlay.querySelector('.search-input').value;
        performSearch(query);
    });
    
    // Suggestion clicks
    searchOverlay.querySelectorAll('.suggestion-tags span').forEach(tag => {
        tag.addEventListener('click', () => {
            searchOverlay.querySelector('.search-input').value = tag.textContent;
            performSearch(tag.textContent);
        });
    });
});

// Perform search
function performSearch(query) {
    if (!query.trim()) return;
    
    console.log('Searching for:', query);
    showToast(`Searching for "${query}"...`, 'info');
    
    // In a real app, this would filter products
    // Close search overlay
    const overlay = document.querySelector('.search-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

// Add search overlay styles
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .search-overlay.active {
        opacity: 1;
    }
    
    .search-container {
        width: 90%;
        max-width: 600px;
        position: relative;
    }
    
    .search-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: #fff;
        font-size: 30px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .search-close:hover {
        transform: rotate(90deg);
    }
    
    .search-wrapper {
        display: flex;
        background: #fff;
        border-radius: 50px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    
    .search-input {
        flex: 1;
        padding: 20px 30px;
        border: none;
        font-size: 18px;
        outline: none;
    }
    
    .search-submit {
        background: #000;
        border: none;
        color: #fff;
        padding: 0 30px;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .search-submit:hover {
        background: #333;
    }
    
    .search-suggestions {
        margin-top: 30px;
        text-align: center;
    }
    
    .search-suggestions h4 {
        color: #fff;
        margin-bottom: 15px;
        font-weight: 400;
    }
    
    .suggestion-tags {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .suggestion-tags span {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        padding: 8px 20px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .suggestion-tags span:hover {
        background: #fff;
        color: #000;
    }
    
    .filter-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #f0f0f0;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 14px;
        margin: 5px;
    }
    
    .remove-filter {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        transition: color 0.3s ease;
    }
    
    .remove-filter:hover {
        color: #000;
    }
    
    .load-more-spinner {
        display: none;
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .filters-sidebar.active {
        display: block;
    }
    
    @media (max-width: 768px) {
        .filters-sidebar {
            position: fixed;
            left: -300px;
            top: 0;
            height: 100%;
            background: #fff;
            z-index: 1000;
            transition: left 0.3s ease;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .filters-sidebar.active {
            left: 0;
        }
    }
`;
document.head.appendChild(searchStyles);

// Export functions for use in other pages
window.storeCart = {
    addToCart: function(product) {
        const cartItem = {
            id: product.id,
            name: product.name,
            category: product.category || 'Shoes',
            price: product.price,
            image: product.image,
            size: product.size || 'US 10',
            color: product.color || 'Black',
            quantity: 1
        };
        
        const existingIndex = cart.findIndex(item => 
            item.id === cartItem.id && 
            item.size === cartItem.size && 
            item.color === cartItem.color
        );
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
            showToast(`${product.name} quantity updated!`, 'success');
        } else {
            cart.push(cartItem);
            showToast(`${product.name} added to cart!`, 'success');
        }
        
        saveCart();
    },
    getCart: () => cart,
    getCartCount: () => cart.reduce((sum, item) => sum + item.quantity, 0)
};

window.storeWishlist = {
    addToWishlist: function(product) {
        if (!wishlist.find(item => item.id === product.id)) {
            wishlist.push(product);
            saveWishlist();
            showToast(`${product.name} added to wishlist!`, 'success');
            return true;
        }
        return false;
    },
    removeFromWishlist: function(productId) {
        const index = wishlist.findIndex(item => item.id === productId);
        if (index > -1) {
            const product = wishlist[index];
            wishlist.splice(index, 1);
            saveWishlist();
            showToast(`${product.name} removed from wishlist!`, 'info');
            return true;
        }
        return false;
    },
    getWishlist: () => wishlist,
    getWishlistCount: () => wishlist.length
};

// Initialize on load
console.log('Store initialized with cart and wishlist integration');

