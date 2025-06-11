// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Initialize or retrieve cart from localStorage
    let cart = JSON.parse(localStorage.getItem('nikeCart')) || [];

    // Elements
    const cartIcon = document.querySelector('.cart-icon');
    const wishlistIcon = document.querySelector('.wishlist-icon');
    const signInBtn = document.querySelector('.btn-primary');
    const logInBtn = document.querySelector('.btn-secondary');
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    // ========== Cart Functions ==========

    function saveCart() {
        localStorage.setItem('nikeCart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Find or create cart badge
        let cartBadge = document.getElementById('cart-count');
        
        // If badge doesn't exist, create it
        if (!cartBadge && cartIcon) {
            cartBadge = document.createElement('span');
            cartBadge.id = 'cart-count';
            cartBadge.className = 'cart-badge';
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(cartBadge);
        }
        
        if (cartBadge) {
            cartBadge.textContent = total;
            // Show/hide badge based on count
            if (total > 0) {
                cartBadge.style.display = 'inline-block';
            } else {
                cartBadge.style.display = 'none';
            }
        }
        
        console.log('Cart updated. Total items:', total);
    }

    function createToast() {
        let toast = document.getElementById('cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cart-toast';
            toast.className = 'cart-toast';
            document.body.appendChild(toast);
            
            // Add default styles if not in CSS
            const style = document.createElement('style');
            style.textContent = `
                .cart-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #000;
                    color: white;
                    padding: 16px 24px;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: all 0.3s ease;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .cart-toast.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .cart-toast.warning {
                    background: #ff9800;
                }
                .cart-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #000;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    border: 2px solid #fff;
                }
            `;
            document.head.appendChild(style);
        }
        return toast;
    }

    function showToast(message, type = 'success') {
        const toast = createToast();
        let icon = 'fa-check';
        
        if (type === 'error') {
            icon = 'fa-times';
            toast.style.background = '#ff4444';
        } else if (type === 'warning') {
            icon = 'fa-exclamation-triangle';
            toast.style.background = '#ff9800';
        } else {
            toast.style.background = '#000';
        }
        
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function addToCart(event) {
        event.preventDefault();
        const button = event.currentTarget;
        
        // Get product data from button's data attributes
        const product = {
            id: button.dataset.id || Date.now().toString(),
            name: button.dataset.name || 'Unknown Product',
            price: parseFloat(button.dataset.price) || 0,
            image: button.dataset.image || '',
            size: button.dataset.size || 'US 10',
            color: button.dataset.color || 'Black',
            quantity: 1
        };

        // Check if product already exists in cart
        const existingIndex = cart.findIndex(item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color
        );
        
        if (existingIndex > -1) {
            // Product already exists, show warning
            showToast(`${product.name} is already in your cart!`, 'warning');
            
            // Add shake animation to button
            button.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                button.style.animation = '';
            }, 500);
        } else {
            // New product, add to cart
            cart.push(product);
            showToast(`${product.name} added to cart!`);
            
            // Add visual feedback to button
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.disabled = true;
            button.style.backgroundColor = '#000';
            button.style.color = '#fff';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 1500);
        }

        // Save and update
        saveCart();
        
        console.log('Current cart:', cart);
    }

    function removeFromCart(productId, size, color) {
        const index = cart.findIndex(item => 
            item.id === productId && 
            item.size === size && 
            item.color === color
        );
        
        if (index > -1) {
            const removedItem = cart[index];
            cart.splice(index, 1);
            saveCart();
            showToast(`${removedItem.name} removed from cart`);
            return true;
        }
        return false;
    }

    function clearCart() {
        if (cart.length === 0) {
            showToast('Cart is already empty', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to clear your entire cart?')) {
            cart = [];
            saveCart();
            showToast('Cart cleared successfully');
        }
    }

    // ========== Event Listeners ==========

    // Attach add-to-cart events
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Cart icon click
    if (cartIcon) {
        cartIcon.addEventListener('click', function () {
            window.location.href = 'cart.html';
        });
    }

    // Wishlist icon click
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', function () {
            window.location.href = 'wishlist.html';
        });
    }

    // Sign In and Log In
    if (signInBtn) {
        signInBtn.addEventListener('click', () => window.location.href = 'signin.html');
    }
    if (logInBtn) {
        logInBtn.addEventListener('click', () => window.location.href = 'login.html');
    }

    // Search overlay toggle
    if (searchIcon && searchOverlay && searchInput && searchClose) {
        searchIcon.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
        });
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        });
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    // Highlight active nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Scroll effect on header
    let lastScroll = 0;
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;
        if (header) {
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        lastScroll = currentScroll;
    });

    // Add shake animation CSS
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // Initialize cart count on page load
    updateCartCount();
    
    // Debug: Log initial cart state
    console.log('Cart initialized with', cart.length, 'items');

    // Expose cart functions globally
    window.cartFunctions = {
        addToCart: function(productData) {
            const product = {
                id: productData.id || Date.now().toString(),
                name: productData.name,
                price: parseFloat(productData.price),
                image: productData.image,
                size: productData.size || 'US 10',
                color: productData.color || 'Black',
                quantity: 1
            };

            const existingIndex = cart.findIndex(item => 
                item.id === product.id && 
                item.size === product.size && 
                item.color === product.color
            );
            
            if (existingIndex > -1) {
                showToast(`${product.name} is already in your cart!`, 'warning');
            } else {
                cart.push(product);
                showToast(`${product.name} added to cart!`);
            }

            saveCart();
        },
        removeFromCart: removeFromCart,
        clearCart: clearCart,
        getCart: () => cart,
        getCartCount: () => cart.reduce((sum, item) => sum + item.quantity, 0)
    };
});




