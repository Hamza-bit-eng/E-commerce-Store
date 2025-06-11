// Cart functionality
let cart = [];

// Load cart from localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartDisplay();
    setupEventListeners();
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('nikeCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('nikeCart', JSON.stringify(cart));
}

// Setup event listeners
function setupEventListeners() {
    // Apply promo code
    document.getElementById('apply-promo').addEventListener('click', applyPromoCode);
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', proceedToCheckout);
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Clear current display
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
        cartCount.textContent = '(0)';
    } else {
        emptyCartMessage.style.display = 'none';
        checkoutBtn.disabled = false;
        cartCount.textContent = `(${cart.length})`;
        
        // Display each cart item
        cart.forEach((item, index) => {
            const cartItemHTML = `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Size: ${item.size} | Color: ${item.color}</p>
                        <p class="item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="qty-input" 
                               onchange="setQuantity(${index}, this.value)">
                                                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="item-actions">
                        <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="remove-item" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
    }
    
    updateOrderSummary();
}

// Update quantity of item
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        saveCart();
        updateCartDisplay();
    }
}

// Set specific quantity
function setQuantity(index, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (cart[index] && newQuantity >= 1) {
        cart[index].quantity = newQuantity;
        saveCart();
        updateCartDisplay();
    }
}

// Remove item from cart
function removeFromCart(index) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        cart.splice(index, 1);
        saveCart();
        updateCartDisplay();
        showNotification('Item removed from cart');
    }
}



// Update the order summary function in cart.js
function updateOrderSummary() {
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 1000 ? 0 : 100; // Free shipping over 1000 L.E
    const total = subtotal + tax + shipping;
    
    // Update summary display with L.E
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} L.E`;
        document.getElementById('tax').textContent = `${tax.toFixed(2)} L.E`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} L.E`;
    document.getElementById('total').textContent = `${total.toFixed(2)} L.E`;
}

// Update cart display function to show L.E
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Clear current display
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
        cartCount.textContent = '(0)';
    } else {
        emptyCartMessage.style.display = 'none';
        checkoutBtn.disabled = false;
        cartCount.textContent = `(${cart.length})`;
        
        // Display each cart item with L.E prices
        cart.forEach((item, index) => {
            const cartItemHTML = `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Size: ${item.size} | Color: ${item.color}</p>
                        <p class="item-price">${item.price.toFixed(2)} L.E</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="1" class="qty-input" 
                               onchange="setQuantity(${index}, this.value)" readonly>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="item-actions">
                        <p class="item-total">${(item.price * item.quantity).toFixed(2)} L.E</p>
                        <button class="remove-item" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
        
        // Disable quantity controls since we don't want overdoing
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
    }
    
    updateOrderSummary();
}

// Modified update quantity function to prevent overdoing
function updateQuantity(index, change) {
    // Function disabled - quantity always stays at 1
    showNotification('Quantity cannot be changed. One item per order.', 'warning');
}

// Modified set quantity function
function setQuantity(index, newQuantity) {
    // Function disabled - quantity always stays at 1
    if (parseInt(newQuantity) !== 1) {
        showNotification('Quantity cannot be changed. One item per order.', 'warning');
        // Reset the input value to 1
        document.querySelectorAll('.qty-input')[index].value = 1;
    }
}

// Updated notification function with warning type
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-check-circle';
    let bgColor = '#000000';
    
    if (type === 'error') {
        icon = 'fa-exclamation-circle';
        bgColor = '#ff0000';
    } else if (type === 'warning') {
        icon = 'fa-exclamation-triangle';
        bgColor = '#ff9800';
    }
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: #ffffff;
        padding: 15px 25px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}



// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // Sample promo codes
    const promoCodes = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'FREESHIP': 'freeship'
    };
    
    if (promoCodes[promoCode]) {
        if (promoCodes[promoCode] === 'freeship') {
            showNotification('Free shipping applied!');
        } else {
            showNotification(`${promoCodes[promoCode] * 100}% discount applied!`);
        }
        promoInput.value = '';
        // Here you would apply the discount to the total
    } else {
        showNotification('Invalid promo code', 'error');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length > 0) {
        showNotification('Redirecting to checkout...');
        // Here you would redirect to checkout page
        setTimeout(() => {
            alert('Checkout functionality would be implemented here');
        }, 1000);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#000000' : '#ff0000'};
        color: #ffffff;
        padding: 15px 25px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);

// Function to add item from home page (to be called from home page)
function addToCart(product) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && item.size === product.size && item.color === product.color
    );
    
    if (existingItemIndex > -1) {
        // If item exists, increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: product.size || 'US 10',
            color: product.color || 'Black',
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
}

// Sample function to simulate adding items from home page
// This would be called from your home page when user clicks "Add to Cart"
function simulateAddFromHomePage() {
    const sampleProduct = {
        id: 'nike-air-max-270',
        name: 'Nike Air Max 270',
        price: 150.00,
        image: '/Photo/shoe1.jpg',
        size: 'US 10',
        color: 'Black'
    };
    
    addToCart(sampleProduct);
    showNotification('Item added to cart!');
}

// Export functions for use in other pages
window.cartFunctions = {
    addToCart: addToCart,
    getCartCount: () => cart.length,
    getCart: () => cart
};



