// Wishlist functionality
let wishlist = [];
let cart = [];

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
    loadCart();
    updateWishlistDisplay();
    updateCartBadge();
});

// Load wishlist from localStorage
function loadWishlist() {
    const savedWishlist = localStorage.getItem('nikeWishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    } else {
        // Sample wishlist items for demo
        wishlist = [
            {
                id: 'nike-air-max-270',
                name: 'Nike Air Max 270',
                category: "Men's Shoes",
                                price: 4500.00,
                image: '/Photo/shoe1.jpg',
                size: 'US 10',
                color: 'Black'
            },
            {
                id: 'nike-react-infinity',
                name: 'Nike React Infinity Run',
                category: "Women's Running Shoes",
                price: 4800.00,
                image: '/Photo/shoe2.jpg',
                size: 'US 8',
                color: 'White'
            },
            {
                id: 'nike-blazer-mid',
                name: "Nike Blazer Mid '77",
                category: 'Lifestyle Shoes',
                price: 3000.00,
                image: '/Photo/shoe3.jpg',
                size: 'US 9',
                color: 'Gray'
            }
        ];
        saveWishlist();
    }
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('nikeCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('nikeWishlist', JSON.stringify(wishlist));
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('nikeCart', JSON.stringify(cart));
}

// Update wishlist display
function updateWishlistDisplay() {
    const wishlistContent = document.getElementById('wishlist-content');
    const emptyWishlist = document.getElementById('empty-wishlist');
    const wishlistCount = document.getElementById('wishlist-count');
    const wishlistActions = document.getElementById('wishlist-actions');
    
    // Update count
    wishlistCount.textContent = wishlist.length;
    
    // Clear content
    wishlistContent.innerHTML = '';
    
    if (wishlist.length === 0) {
        // Show empty state
        emptyWishlist.style.display = 'block';
        wishlistActions.style.display = 'none';
    } else {
        // Hide empty state
        emptyWishlist.style.display = 'none';
        wishlistActions.style.display = 'flex';
        
        // Display wishlist items
        wishlist.forEach((item, index) => {
            const wishlistItemHTML = `
                <div class="wishlist-item" data-index="${index}" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="product-image">
                    <div class="product-details">
                        <h3>${item.name}</h3>
                        <p class="product-category">${item.category}</p>
                        <p class="product-price">${item.price.toFixed(2)} L.E</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn-add-to-cart" onclick="addToCart(${index})">
                            <i class="fas fa-shopping-bag"></i> Add to Cart
                        </button>
                        <button class="btn-remove" onclick="removeFromWishlist(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            wishlistContent.innerHTML += wishlistItemHTML;
        });
    }
}

// Remove item from wishlist
function removeFromWishlist(index) {
    const item = wishlist[index];
    
    // Add animation
    const itemElement = document.querySelector(`[data-index="${index}"]`);
    if (itemElement) {
        itemElement.style.animation = 'slideOut 0.3s ease forwards';
        
        setTimeout(() => {
            wishlist.splice(index, 1);
            saveWishlist();
            updateWishlistDisplay();
            showToast(`${item.name} removed from wishlist`, 'success');
        }, 300);
    }
}

// Add item to cart
function addToCart(index) {
    const item = wishlist[index];
    
    // Check if item already exists in cart
    const existingIndex = cart.findIndex(cartItem => 
        cartItem.id === item.id && 
        cartItem.size === item.size && 
        cartItem.color === item.color
    );
    
    if (existingIndex > -1) {
        // Item exists, increase quantity
        cart[existingIndex].quantity += 1;
        showToast(`${item.name} quantity updated in cart`, 'success');
    } else {
        // Add new item to cart
        const cartItem = {
            ...item,
            quantity: 1
        };
        cart.push(cartItem);
        showToast(`${item.name} added to cart`, 'success');
    }
    
    // Save cart and update badge
    saveCart();
    updateCartBadge();
    
    // Add animation to button
    const button = event.target.closest('.btn-add-to-cart');
    if (button) {
        button.classList.add('loading');
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        
        setTimeout(() => {
            button.classList.remove('loading');
            button.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
        }, 1500);
    }
}

// Clear all wishlist items
function clearAllWishlist() {
    if (wishlist.length === 0) {
        showToast('Wishlist is already empty', 'warning');
        return;
    }
    
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        // Add fade out animation to all items
        document.querySelectorAll('.wishlist-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'slideOut 0.3s ease forwards';
            }, index * 50);
        });
        
        setTimeout(() => {
            wishlist = [];
            saveWishlist();
            updateWishlistDisplay();
            showToast('Wishlist cleared successfully', 'success');
        }, 300 + (wishlist.length * 50));
    }
}

// Add all items to cart
function addAllToCart() {
    if (wishlist.length === 0) {
        showToast('No items in wishlist', 'warning');
        return;
    }
    
    let itemsAdded = 0;
    
    wishlist.forEach(item => {
        const existingIndex = cart.findIndex(cartItem => 
            cartItem.id === item.id && 
            cartItem.size === item.size && 
            cartItem.color === item.color
        );
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }
        itemsAdded++;
    });
    
    saveCart();
    updateCartBadge();
    showToast(`${itemsAdded} items added to cart`, 'success');
    
    // Optional: Clear wishlist after adding all to cart
    if (confirm('Remove items from wishlist after adding to cart?')) {
        wishlist = [];
        saveWishlist();
        updateWishlistDisplay();
    }
}

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        
        if (totalItems > 0) {
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Function to add item to wishlist from other pages
window.addToWishlist = function(product) {
    // Check if item already exists in wishlist
    const exists = wishlist.some(item => 
        item.id === product.id && 
        item.size === product.size && 
        item.color === product.color
    );
    
    if (exists) {
        showToast('Item already in wishlist', 'warning');
        return false;
    }
    
    // Add to wishlist
    wishlist.push({
        id: product.id,
        name: product.name,
        category: product.category || 'Shoes',
        price: product.price,
        image: product.image,
        size: product.size || 'US 10',
        color: product.color || 'Black'
    });
    
    saveWishlist();
    showToast(`${product.name} added to wishlist`, 'success');
    return true;
};

// Function to check if item is in wishlist
window.isInWishlist = function(productId, size, color) {
    return wishlist.some(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );
};

// Function to get wishlist count
window.getWishlistCount = function() {
    return wishlist.length;
};

// Add page visibility handler to sync data
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Reload data when page becomes visible
        loadWishlist();
        loadCart();
        updateWishlistDisplay();
        updateCartBadge();
    }
});

// Add storage event listener to sync across tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'nikeWishlist') {
        loadWishlist();
        updateWishlistDisplay();
    } else if (e.key === 'nikeCart') {
        loadCart();
        updateCartBadge();
    }
});