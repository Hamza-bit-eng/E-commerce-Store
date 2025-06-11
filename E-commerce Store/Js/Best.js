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



// Best Sellers functionality with cart and wishlist integration
let cart = [];
let wishlist = [];
let bestProducts = [];
let currentFilter = 'all';
let productsLoaded = 6; // Initial products shown

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load cart and wishlist from localStorage
    loadCart();
    loadWishlist();
    
    // Initialize best sellers
    initializeBestSellers();
    
    // Setup event listeners
    setupEventListeners();
    
    // Animate hero section
    animateHeroSection();
    
    // Initialize counters
    initializeCounters();
    
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

// Initialize best sellers products
function initializeBestSellers() {
    bestProducts = [
        {
            id: 'nike-air-max-2024',
            name: 'Nike Air Max 2024',
            category: 'shoes',
            subcategory: "Men's Running Shoes",
            price: 5280,
            images: [
                '/Photo/Prodect-1.png',
                '/Photo/Prodect-2.png',
                '/Photo/Prodect-3.png',
                '/Photo/Air-Gordan-Blue.jpg'
            ],
            colors: ['#000', '#0066cc', '#d43f21'],
            sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10'],
            rating: 4.8,
            reviews: 2341,
            soldThisWeek: 5200,
            stock: 15,
            rank: 1
        },
        {
            id: 'nike-react-infinity',
            name: 'Nike React Infinity',
            category: 'shoes',
            subcategory: "Women's Running Shoes",
            price: 7500,
            originalPrice: 10500,
            discount: 25,
            images: ['/Photo/Prodect-2.png'],
            colors: ['#e91e63', '#9c27b0', '#3f51b5'],
            sizes: ['5', '5.5', '6', '6.5', '7', '7.5', '8'],
            rating: 5.0,
            reviews: 1892,
            soldThisWeek: 3800,
            rank: 2
        },
        {
            id: 'nike-hoodie-tech',
            name: 'Nike Hoodie',
            category: 'clothing',
            subcategory: "Men's Sportswear",
            price: 7500,
            originalPrice: 10500,
            discount: 25,
            images: ['/Photo/traning.jpg'],
            colors: ['#e91e63', '#9c27b0', '#3f51b5'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            rating: 5.0,
            reviews: 1892,
            soldThisWeek: 3800,
            rank: 3
        }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.querySelector('.cart-btn').addEventListener('click', () => {
        window.location.href = '../HTML/cart.html';
    });
    
    document.querySelector('.wishlist-btn').addEventListener('click', () => {
        window.location.href = '../HTML/wishlist.html';
    });
    
    // Filter pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', handleFilterClick);
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => handleAddToCart(index));
    });
    
    // Favorite buttons
    document.querySelectorAll('.favorite-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => handleFavoriteToggle(index));
    });
    
    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => openQuickView(index));
    });
    
    // 360° view
    document.querySelectorAll('.view-360').forEach((btn, index) => {
        btn.addEventListener('click', () => handle360View(index));
    });
    
    // Color options
    document.querySelectorAll('.color-option').forEach(colorBtn => {
        colorBtn.addEventListener('click', handleColorSelect);
    });
    
    // Load more button
    document.querySelector('.load-more-btn').addEventListener('click', loadMoreProducts);
    
    // Modal functionality
    setupModalListeners();
    
    // Carousel functionality
    setupCarousel();
    
    // Search functionality
    document.querySelector('.search-btn').addEventListener('click', openSearch);
}

// Handle add to cart
function handleAddToCart(productIndex) {
    const product = bestProducts[productIndex];
    const sizeSelect = document.querySelectorAll('.size-select')[productIndex];
    const selectedSize = sizeSelect.value;
    
    // Validate size selection
    if (selectedSize === 'Select Size') {
        showToast('Please select a size', 'error');
        sizeSelect.focus();
        return;
    }
    
    // Get selected color
    const productCard = document.querySelectorAll('.best-product')[productIndex];
    const activeColor = productCard.querySelector('.color-option.active');
    const selectedColor = activeColor ? activeColor.style.background : product.colors[0];
    
    // Create cart item
    const cartItem = {
        id: product.id,
        name: product.name,
        category: product.subcategory,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity: 1
    };
    
    // Check if item already exists in cart
    const existingIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size && 
        item.color === cartItem.color
    );
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
        showToast(`${product.name} quantity updated in cart`, 'success');
    } else {
        cart.push(cartItem);
        showToast(`${product.name} added to cart`, 'success');
    }
    
    // Save cart
    saveCart();
    
    // Animate button
    animateAddToCartButton(productIndex);
}

// Handle favorite toggle
function handleFavoriteToggle(productIndex) {
    const product = bestProducts[productIndex];
    const favoriteBtn = document.querySelectorAll('.favorite-btn')[productIndex];
    const icon = favoriteBtn.querySelector('i');
    
    // Check if item exists in wishlist
    const existingIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        icon.classList.remove('fas');
        icon.classList.add('far');
        favoriteBtn.classList.remove('active');
        showToast(`${product.name} removed from wishlist`, 'info');
    } else {
        // Add to wishlist
        const wishlistItem = {
            id: product.id,
            name: product.name,
            category: product.subcategory,
            price: product.price,
            image: product.images[0],
            size: product.sizes[Math.floor(product.sizes.length / 2)],
            color: product.colors[0]
        };
        
        wishlist.push(wishlistItem);
        icon.classList.remove('far');
        icon.classList.add('fas');
        favoriteBtn.classList.add('active');
        showToast(`${product.name} added to wishlist`, 'success');
    }
    
    // Save wishlist
    saveWishlist();
    
    // Animate button
    animateFavoriteButton(favoriteBtn);
}

// Update cart badge
function updateCartBadge() {
    const badge = document.querySelector('.cart-btn .badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
        
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
        
        if (wishlist.length > 0) {
            badge.classList.add('bounce');
            setTimeout(() => badge.classList.remove('bounce'), 300);
        }
    }
    
    // Update favorite icons
    updateFavoriteIcons();
}

// Update favorite icons based on wishlist
function updateFavoriteIcons() {
    document.querySelectorAll('.best-product').forEach((card, index) => {
        const product = bestProducts[index];
        if (product) {
            const favoriteBtn = card.querySelector('.favorite-btn');
            const icon = favoriteBtn.querySelector('i');
            
            if (wishlist.some(item => item.id === product.id)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                favoriteBtn.classList.add('active');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                favoriteBtn.classList.remove('active');
            }
        }
    });
}

// Handle filter click
function handleFilterClick(e) {
    const pill = e.target;
    const filter = pill.dataset.filter;
    
    // Update active state
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    
    // Update current filter
    currentFilter = filter;
    
    // Filter products
    filterProducts(filter);
}


// Handle 360° view
function handle360View(productIndex) {
    const product = document.querySelectorAll('.best-product')[productIndex];
    const images = product.querySelectorAll('.product-360 .product-img');
    let currentImageIndex = 0;
    let isRotating = false;
    
    if (isRotating) return;
    
    isRotating = true;
    const rotationInterval = setInterval(() => {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
    }, 150);
    
    // Stop after one full rotation
    setTimeout(() => {
        clearInterval(rotationInterval);
        isRotating = false;
    }, 150 * images.length * 2);
}

// Handle color selection
function handleColorSelect(e) {
    const colorOption = e.target;
    const productCard = colorOption.closest('.best-product');
    const allColors = productCard.querySelectorAll('.color-option');
    
    // Update active state
    allColors.forEach(color => color.classList.remove('active'));
    colorOption.classList.add('active');
}

// Open quick view modal
function openQuickView(productIndex) {
    const product = bestProducts[productIndex];
    const modal = document.querySelector('.quick-view-modal');
    
    // Update modal content
    updateModalContent(product);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Update modal content
function updateModalContent(product) {
    const modal = document.querySelector('.quick-view-modal');
    
    // Update images
    const mainImage = modal.querySelector('.main-image img');
    mainImage.src = product.images[0];
    
    // Update thumbnails
    const thumbnailList = modal.querySelector('.thumbnail-list');
    thumbnailList.innerHTML = '';
    product.images.forEach((image, index) => {
        const thumb = document.createElement('img');
        thumb.src = image;
        thumb.alt = `View ${index + 1}`;
        thumb.className = index === 0 ? 'active' : '';
        thumb.addEventListener('click', () => {
            mainImage.src = image;
            thumbnailList.querySelectorAll('img').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        thumbnailList.appendChild(thumb);
    });
    
    // Update product info
    modal.querySelector('.modal-info h2').textContent = product.name;
    modal.querySelector('.modal-price').textContent = `L.E ${product.price.toLocaleString()}`;
    modal.querySelector('.modal-rating span').textContent = `${product.rating} (${product.reviews.toLocaleString()} reviews)`;
    
    // Update colors
    const colorOptions = modal.querySelector('.color-options');
    colorOptions.innerHTML = '';
    product.colors.forEach((color, index) => {
        const colorLabel = document.createElement('label');
        colorLabel.className = 'color-radio';
        colorLabel.innerHTML = `
            <input type="radio" name="modal-color" ${index === 0 ? 'checked' : ''}>
            <span class="color-swatch" style="background: ${color}"></span>
        `;
        colorOptions.appendChild(colorLabel);
    });
    
    // Update sizes
    const sizeSelect = modal.querySelector('.modal-size-select');
    sizeSelect.innerHTML = '<option>Select Size</option>';
    product.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = `US ${size}`;
        sizeSelect.appendChild(option);
    });
    
    // Store product data for add to cart
    modal.dataset.productId = product.id;
}

// Setup modal listeners
function setupModalListeners() {
    const modal = document.querySelector('.quick-view-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const addToCartBtn = modal.querySelector('.modal-add-to-cart');
    const wishlistBtn = modal.querySelector('.modal-wishlist');
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Add to cart from modal
    addToCartBtn.addEventListener('click', () => {
        const productId = modal.dataset.productId;
        const product = bestProducts.find(p => p.id === productId);
        const selectedSize = modal.querySelector('.modal-size-select').value;
        const selectedColor = modal.querySelector('input[name="modal-color"]:checked')
            .nextElementSibling.style.background;
        
        if (selectedSize === 'Select Size') {
            showToast('Please select a size', 'error');
            return;
        }
        
        const cartItem = {
            id: product.id,
            name: product.name,
            category: product.subcategory,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor,
            quantity: 1
        };
        
        const existingIndex = cart.findIndex(item => 
            item.id === cartItem.id && 
            item.size === cartItem.size && 
            item.color === cartItem.color
        );
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
            showToast(`${product.name} quantity updated in cart`, 'success');
        } else {
            cart.push(cartItem);
            showToast(`${product.name} added to cart`, 'success');
        }
        
        saveCart();
        closeModal();
    });
    
    // Add to wishlist from modal
    wishlistBtn.addEventListener('click', () => {
        const productId = modal.dataset.productId;
        const product = bestProducts.find(p => p.id === productId);
        const icon = wishlistBtn.querySelector('i');
        
        const existingIndex = wishlist.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            wishlist.splice(existingIndex, 1);
            icon.classList.remove('fas');
            icon.classList.add('far');
            showToast(`${product.name} removed from wishlist`, 'info');
        } else {
            const wishlistItem = {
                id: product.id,
                name: product.name,
                category: product.subcategory,
                price: product.price,
                image: product.images[0],
                size: product.sizes[0],
                color: product.colors[0]
            };
            
            wishlist.push(wishlistItem);
            icon.classList.remove('far');
            icon.classList.add('fas');
            showToast(`${product.name} added to wishlist`, 'success');
        }
        
        saveWishlist();
    });
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.quick-view-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Setup carousel
function setupCarousel() {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.trending-item');
    
    let currentIndex = 0;
    const itemsPerView = 4;
    const itemWidth = 100 / itemsPerView;
    
    // Set initial position
    updateCarousel();
    
    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(items.length - itemsPerView, currentIndex + 1);
        updateCarousel();
    });
    
    function updateCarousel() {
        const offset = -(currentIndex * itemWidth);
        track.style.transform = `translateX(${offset}%)`;
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= items.length - itemsPerView;
    }
}

// Animate hero section
function animateHeroSection() {
    const heroTitle = document.querySelector('.hero-title');
    const words = heroTitle.querySelectorAll('.word');
    
    words.forEach((word, index) => {
        word.style.animation = `slideInUp 0.8s ease ${index * 0.1}s forwards`;
        word.style.opacity = '0';
    });
    
    // Animate floating shoe
    const floatingShoe = document.querySelector('.floating-shoe');
    if (floatingShoe) {
        floatingShoe.style.animation = 'float 3s ease-in-out infinite';
    }
}

// Initialize counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const increment = target / speed;
                
                const updateCount = () => {
                    const count = +counter.innerText.replace(/[^\d]/g, '');
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target.toLocaleString();
                        if (counter.innerText.includes('98')) {
                            counter.innerText += '%';
                        } else if (counter.innerText.includes('50')) {
                            counter.innerText += '+';
                        }
                    }
                };
                
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Load more products
function loadMoreProducts() {
    const button = document.querySelector('.load-more-btn');
    const container = document.querySelector('.products-container');
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    // Simulate loading delay
    setTimeout(() => {
        // Generate more products (in real app, this would be an API call)
        for (let i = 0; i < 3; i++) {
            const newProduct = createProductElement(productsLoaded + i + 1);
            container.appendChild(newProduct);
        }
        
        productsLoaded += 3;
        
        // Reset button
        button.disabled = false;
        button.innerHTML = '<span>Show More Best Sellers</span><i class="fas fa-chevron-down"></i>';
        
        // Initialize new products
        initializeNewProducts();
        
               // Hide button if all products loaded
        if (productsLoaded >= 12) {
            button.style.display = 'none';
        }
    }, 1500);
}

// Create product element
function createProductElement(rank) {
    const product = document.createElement('div');
    product.className = 'best-product';
    product.dataset.category = 'shoes';
    product.dataset.rank = rank;
    
    product.innerHTML = `
        <div class="rank-badge ${rank === 2 ? 'silver' : rank === 3 ? 'bronze' : ''}">
            <span class="rank-number">#${rank}</span>
            <span class="rank-text">Best Seller</span>
        </div>
        
        <div class="product-image-wrapper">
            <div class="product-360">
                <img src="/Photo/Prodect-${(rank % 3) + 1}.png" alt="Product ${rank}" class="product-img active">
            </div>
            <button class="quick-view-btn">Quick View</button>
        </div>
        
        <div class="product-details">
            <div class="product-header">
                <h3 class="product-name">Nike Product ${rank}</h3>
                <button class="favorite-btn">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            
            <p class="product-category">Men's Shoes</p>
            
            <div class="product-rating">
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </div>
                <span class="rating-text">4.5 (${Math.floor(Math.random() * 1000 + 500)} reviews)</span>
            </div>
            
            <div class="product-price">
                <span class="current-price">L.E ${(Math.floor(Math.random() * 5000) + 3000).toLocaleString()}</span>
                <span class="sold-count">${(Math.random() * 5 + 1).toFixed(1)}K sold this week</span>
            </div>
            
            <div class="product-colors">
                <span class="color-option active" style="background: #000"></span>
                <span class="color-option" style="background: #fff"></span>
                <span class="color-option" style="background: #3498db"></span>
            </div>
            
            <div class="product-sizes">
                <select class="size-select">
                    <option>Select Size</option>
                    <option>US 7</option>
                    <option>US 8</option>
                    <option>US 9</option>
                    <option>US 10</option>
                </select>
            </div>
            
            <button class="add-to-cart-btn">
                <span class="btn-text">Add to Cart</span>
                <span class="btn-icon"><i class="fas fa-shopping-bag"></i></span>
            </button>
        </div>
    `;
    
    return product;
}

// Initialize new products
function initializeNewProducts() {
    // Re-attach event listeners to new elements
    const newProducts = document.querySelectorAll('.best-product');
    const startIndex = productsLoaded - 3;
    
    for (let i = startIndex; i < productsLoaded; i++) {
        if (newProducts[i]) {
            const product = newProducts[i];
            
            // Add to cart button
            const addBtn = product.querySelector('.add-to-cart-btn');
            addBtn.addEventListener('click', () => handleAddToCart(i));
            
            // Favorite button
            const favBtn = product.querySelector('.favorite-btn');
            favBtn.addEventListener('click', () => handleFavoriteToggle(i));
            
            // Quick view button
            const quickBtn = product.querySelector('.quick-view-btn');
            quickBtn.addEventListener('click', () => openQuickView(i));
            
            // Color options
            product.querySelectorAll('.color-option').forEach(colorBtn => {
                colorBtn.addEventListener('click', handleColorSelect);
            });
        }
    }
    
    // Update wishlist icons
    updateFavoriteIcons();
}

// Animate add to cart button
function animateAddToCartButton(index) {
    const button = document.querySelectorAll('.add-to-cart-btn')[index];
    const btnText = button.querySelector('.btn-text');
    const btnIcon = button.querySelector('.btn-icon');
    
    // Store original text
    const originalText = btnText.textContent;
    
    // Animate
    button.classList.add('adding');
    btnText.textContent = 'Added!';
    btnIcon.innerHTML = '<i class="fas fa-check"></i>';
    
    setTimeout(() => {
        button.classList.remove('adding');
        btnText.textContent = originalText;
        btnIcon.innerHTML = '<i class="fas fa-shopping-bag"></i>';
    }, 1500);
}

// Animate favorite button
function animateFavoriteButton(button) {
    button.classList.add('pulse');
    setTimeout(() => button.classList.remove('pulse'), 300);
}

// Open search overlay
function openSearch() {
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <button class="search-close"><i class="fas fa-times"></i></button>
            <div class="search-wrapper">
                <input type="text" class="search-input" placeholder="Search best sellers...">
                <button class="search-submit"><i class="fas fa-search"></i></button>
            </div>
            <div class="search-suggestions">
                <h4>Popular Searches</h4>
                <div class="suggestion-tags">
                    <span>Nike Air Max 2024</span>
                    <span>React Infinity</span>
                    <span>Best Running Shoes</span>
                    <span>On Sale</span>
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
    
    // Search functionality
    const searchInput = searchOverlay.querySelector('.search-input');
    const searchSubmit = searchOverlay.querySelector('.search-submit');
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(e.target.value);
        }
    });
    
    searchSubmit.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    // Suggestion clicks
    searchOverlay.querySelectorAll('.suggestion-tags span').forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.textContent;
            performSearch(tag.textContent);
        });
    });
}

// Perform search
function performSearch(query) {
    if (!query.trim()) return;
    
    showToast(`Searching for "${query}"...`, 'info');
    
    // Close search overlay
    const overlay = document.querySelector('.search-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
    
    // In real app, this would filter products based on search query
    console.log('Searching for:', query);
}

// Show toast notification
function showToast(message, type = 'success') {
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
            
            @keyframes slideInUp {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
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
            
            .adding {
                background: #4caf50 !important;
                transform: scale(1.05);
            }
            
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
            
            .quick-view-modal.active {
                display: flex;
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

// Export functions for use in other pages
window.bestSellersCart = {
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

window.bestSellersWishlist = {
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

// Auto-rotate products showcase
function autoRotateProducts() {
    const products = document.querySelectorAll('.best-product');
    
    products.forEach((product, index) => {
        const images = product.querySelectorAll('.product-360 .product-img');
        if (images.length > 1) {
            let currentIndex = 0;
            
            setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, 3000 + (index * 500)); // Stagger the rotations
        }
    });
}

// Initialize auto-rotate after page load
setTimeout(autoRotateProducts, 2000);

// Track product views (analytics)
function trackProductView(productId) {
    // In a real app, this would send data to analytics
    console.log('Product viewed:', productId);
}

// Handle ESC key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.quick-view-modal.active');
        const searchOverlay = document.querySelector('.search-overlay.active');
        
        if (modal) closeModal();
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            setTimeout(() => searchOverlay.remove(), 300);
        }
    }
});

// Lazy load images for better performance
function lazyLoadImages() {
    const images = document.querySelectorAll('.product-img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy load if needed
if (document.querySelectorAll('.product-img[data-src]').length > 0) {
    lazyLoadImages();
}

// Add to cart animation
function animateProductToCart(productElement) {
    const rect = productElement.getBoundingClientRect();
    const cartBtn = document.querySelector('.cart-btn');
    const cartRect = cartBtn.getBoundingClientRect();
    
    const flyingProduct = productElement.cloneNode(true);
    flyingProduct.style.position = 'fixed';
    flyingProduct.style.top = `${rect.top}px`;
    flyingProduct.style.left = `${rect.left}px`;
    flyingProduct.style.width = `${rect.width}px`;
    flyingProduct.style.height = `${rect.height}px`;
    flyingProduct.style.zIndex = '10000';
    flyingProduct.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    flyingProduct.style.pointerEvents = 'none';
    
    document.body.appendChild(flyingProduct);
    
    setTimeout(() => {
        flyingProduct.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.1)`;
        flyingProduct.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        flyingProduct.remove();
        updateCartBadge();
    }, 800);
}

// Initialize tooltips for stock indicators
function initializeTooltips() {
    const stockIndicators = document.querySelectorAll('.stock-indicator');
    
    stockIndicators.forEach(indicator => {
        indicator.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Limited stock - Order soon!';
            tooltip.style.cssText = `
                position: absolute;
                background: #000;
                color: #fff;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                top: -35px;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
                z-index: 1000;
            `;
            
            indicator.style.position = 'relative';
            indicator.appendChild(tooltip);
        });
        
        indicator.addEventListener('mouseleave', () => {
            const tooltip = indicator.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Initialize tooltips
initializeTooltips();

// Smooth scroll to top when changing filters
function scrollToProducts() {
    const productsSection = document.querySelector('.best-sellers-section');
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize everything
console.log('Best Sellers page initialized with cart and wishlist integration');

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}


