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



// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Form Handling
    const contactForm = document.getElementById('contactForm');
    const messageTextarea = document.getElementById('message');
    const charCount = document.querySelector('.char-count');
    const submitBtn = document.querySelector('.submit-btn');
    const successModal = document.getElementById('successModal');
    
    // Character Counter
    messageTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = `${length}/500`;
        
        if (length > 500) {
            this.value = this.value.substring(0, 500);
            charCount.style.color = 'red';
        } else {
            charCount.style.color = 'var(--nike-gray)';
        }
    });
    
    // File Upload
    const fileInput = document.getElementById('attachment');
    const fileList = document.querySelector('.file-list');
    
    fileInput.addEventListener('change', function() {
        fileList.innerHTML = '';
        Array.from(this.files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <button type="button" onclick="removeFile(this)">×</button>
            `;
            fileList.appendChild(fileItem);
        });
    });
    
    // Form Submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            successModal.classList.add('active');
            contactForm.reset();
            charCount.textContent = '0/500';
            fileList.innerHTML = '';
        }, 2000);
    });
    
    // Close Success Modal
    document.querySelector('.modal-close').addEventListener('click', function() {
        successModal.classList.remove('active');
    });
    
       // Chat Widget - Continued
    const chatToggle = document.querySelector('.chat-toggle');
    const chatWindow = document.querySelector('.chat-window');
    const chatClose = document.querySelector('.chat-close');
    const chatInput = document.querySelector('.chat-footer input');
    const chatSendBtn = document.querySelector('.chat-footer button');
    const chatBody = document.querySelector('.chat-body');
    
    // Toggle Chat
    chatToggle.addEventListener('click', function() {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
            // Remove badge when chat opens
            const badge = this.querySelector('.chat-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        }
    });
    
    // Close Chat
    chatClose.addEventListener('click', function() {
        chatWindow.classList.remove('active');
    });
    
    // Send Message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message user';
            userMessage.innerHTML = `<p>${message}</p>`;
            chatBody.appendChild(userMessage);
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // Simulate bot response
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.className = 'chat-message bot';
                botMessage.innerHTML = `
                    <img src="/Photo/bot-avatar.png" alt="Bot">
                    <p>${getBotResponse(message)}</p>
                `;
                chatBody.appendChild(botMessage);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        }
    }
    
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Bot Responses
    function getBotResponse(message) {
        const responses = {
            'order': 'You can track your order by logging into your account or using the tracking number sent to your email.',
            'shipping': 'We offer free standard shipping (3-5 days) on orders over $50. Express shipping is available for $15.',
            'return': 'You can return items within 30 days of purchase. Items must be unworn and in original packaging.',
            'size': 'Check our size guide on the product page. If you\'re between sizes, we recommend going up.',
            'default': 'Thanks for your message! A customer service representative will be with you shortly.'
        };
        
        const lowercaseMessage = message.toLowerCase();
        for (const key in responses) {
            if (lowercaseMessage.includes(key)) {
                return responses[key];
            }
        }
        return responses.default;
    }
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
    
    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Smooth Scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form Field Animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Remove file function
    window.removeFile = function(button) {
        button.parentElement.remove();
    };
    
    // Map Interaction
    const mapContainer = document.querySelector('.map-container');
    const directionsBtn = document.querySelector('.directions-btn');
    
    directionsBtn.addEventListener('click', function() {
        // Open Google Maps with Nike HQ location
        window.open('https://maps.google.com/?q=Nike+Headquarters+Beaverton+Oregon', '_blank');
    });
    
    // Add map hover effect
    mapContainer.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    mapContainer.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // FAQ Toggle Animation
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        summary.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.open) {
                    otherItem.open = false;
                }
            });
        });
    });
    
    // Social Links Hover Effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const social = this.getAttribute('data-social');
            const colors = {
                facebook: '#1877f2',
                twitter: '#1da1f2',
                instagram: '#e4405f',
                youtube: '#ff0000'
            };
            this.style.backgroundColor = colors[social];
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    });
    
    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const email = this.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.parentElement.classList.add('error');
            showError(this.parentElement, 'Please enter a valid email address');
        } else {
            this.parentElement.classList.remove('error');
            removeError(this.parentElement);
        }
    });
    
    // Error handling functions
    function showError(element, message) {
        removeError(element);
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        error.style.cssText = `
            color: red;
            font-size: 12px;
            position: absolute;
            bottom: -20px;
            left: 0;
            animation: fadeIn 0.3s ease;
        `;
        element.appendChild(error);
    }
    
    function removeError(element) {
        const error = element.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }
    
    // Page scroll animations
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.contact-header');
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Initialize tooltips
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: var(--nike-black);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
            
            this.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.remove();
                }, 300);
            });
        });
    });
    
    // Performance optimization - Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});
