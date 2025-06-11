// User database simulation (in real app, this would be server-side)
let users = JSON.parse(localStorage.getItem('nikeUsers')) || [
    {
        id: 1,
        email: 'demo@nike.com',
        password: 'demo123', // In real app, passwords would be hashed
        name: 'Demo User',
        memberSince: '2024-01-01'
    }
];

// Current user session
let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const rememberMe = document.getElementById('rememberMe');
    const forgotPassword = document.getElementById('forgotPassword');
    const loginBtn = document.getElementById('loginBtn');
    const messageContainer = document.getElementById('message-container');
    
    // Social login buttons
    const googleLogin = document.getElementById('googleLogin');
    const facebookLogin = document.getElementById('facebookLogin');
    const appleLogin = document.getElementById('appleLogin');

    // Check if user is already logged in
    checkExistingSession();

    // Password visibility toggle
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Attempt login
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        const loginResult = authenticateUser(email, password);
        
        if (loginResult.success) {
            handleSuccessfulLogin(loginResult.user);
        } else {
            handleFailedLogin(loginResult.message);
        }
        
        setLoadingState(false);
    });

    // Email validation on blur
    emailInput.addEventListener('blur', function() {
        validateEmail(this.value);
    });

    // Password validation on blur
    passwordInput.addEventListener('blur', function() {
        validatePassword(this.value);
    });

    // Forgot password
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        handleForgotPassword();
    });

    // Social login handlers
    googleLogin.addEventListener('click', () => handleSocialLogin('Google'));
    facebookLogin.addEventListener('click', () => handleSocialLogin('Facebook'));
    appleLogin.addEventListener('click', () => handleSocialLogin('Apple'));

    // Check remember me on load
    checkRememberMe();
});

// Check existing session
function checkExistingSession() {
    if (currentUser) {
        showMessage('You are already logged in. Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }
}

// Validate form
function validateForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    if (!validateEmail(email)) {
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        isValid = false;
    }
    
    return isValid;
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailError = document.getElementById('email-error');
    const emailInput = document.getElementById('email');
    
    if (!email) {
        emailError.textContent = 'Email is required';
        emailInput.classList.add('error');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailInput.classList.add('error');
        return false;
    }
    
    emailError.textContent = '';
    emailInput.classList.remove('error');
    return true;
}

// Validate password
function validatePassword(password) {
    const passwordError = document.getElementById('password-error');
    const passwordInput = document.getElementById('password');
    
    if (!password) {
        passwordError.textContent = 'Password is required';
        passwordInput.classList.add('error');
        return false;
    }
    
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordInput.classList.add('error');
        return false;
    }
    
    passwordError.textContent = '';
    passwordInput.classList.remove('error');
    return true;
}

// Clear errors
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(elem => {
        elem.textContent = '';
    });
    
    document.querySelectorAll('.error').forEach(elem => {
        elem.classList.remove('error');
    });
}

// Authenticate user
function authenticateUser(email, password) {
    // Check if user exists
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        return {
            success: false,
            message: 'No account found with this email address'
        };
    }
    
    // Check password
    if (user.password !== password) {
        return {
            success: false,
            message: 'Incorrect password. Please try again'
        };
    }
    
    return {
        success: true,
        user: user
    };
}

// Handle successful login
function handleSuccessfulLogin(user) {
    // Save session
    currentUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        memberSince: user.memberSince,
        loginTime: new Date().toISOString()
    };
    
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Handle remember me
    if (document.getElementById('rememberMe').checked) {
        localStorage.setItem('rememberedEmail', user.email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
    
    // Show success message
    showMessage('Login successful! Redirecting...', 'success');
    
    // Update UI
    const loginForm = document.getElementById('loginForm');
    loginForm.style.display = 'none';
    
    // Show success animation
    const successHTML = `
        <div class="success-checkmark show">
            <svg viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" stroke="#000" stroke-width="2"/>
                <path fill="none" stroke="#000" stroke-width="3" d="M14 27l7 7 16-16"/>
            </svg>
        </div>
        <h3 style="text-align: center; margin-top: 20px;">Welcome back, ${user.name}!</h3>
    `;
    
    const formContainer = document.querySelector('.form-container');
    const successDiv = document.createElement('div');
    successDiv.innerHTML = successHTML;
    formContainer.appendChild(successDiv);
    
    // Redirect after delay
    setTimeout(() => {
        // Check if there's a return URL
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('return') || '../index.html';
        window.location.href = returnUrl;
    }, 2000);
}

// Handle failed login
function handleFailedLogin(message) {
    showMessage(message, 'error');
    
    // Shake the form
    const loginForm = document.getElementById('loginForm');
    loginForm.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        loginForm.style.animation = '';
    }, 500);
}

// Show message
function showMessage(text, type) {
    const messageContainer = document.getElementById('message-container');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    messageDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${text}</span>
    `;
    
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 5000);
}

// Set loading state
function setLoadingState(isLoading) {
    const loginBtn = document.getElementById('loginBtn');
    
    if (isLoading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

// Handle forgot password
function handleForgotPassword() {
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        showMessage('Please enter your email address first', 'error');
        return;
    }
    
    // Check if email exists
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
        showMessage(`Password reset link sent to ${email}`, 'success');
        // In real app, would send actual reset email
    } else {
        showMessage('No account found with this email address', 'error');
    }
}

// Handle social login
async function handleSocialLogin(provider) {
    setLoadingState(true);
    
    // Simulate social login
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create/find social user
    const socialUser = {
        id: Date.now(),
        email: `user@${provider.toLowerCase()}.com`,
        name: `${provider} User`,
        memberSince: new Date().toISOString(),
        provider: provider
    };
    
    // Add to users if not exists
    const existingUser = users.find(u => u.email === socialUser.email);
    if (!existingUser) {
        users.push(socialUser);
        localStorage.setItem('nikeUsers', JSON.stringify(users));
    }
    
    handleSuccessfulLogin(existingUser || socialUser);
    setLoadingState(false);
}

// Check remember me
function checkRememberMe() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    svg {
        animation: drawCheck 0.5s ease forwards;
    }
    
    @keyframes drawCheck {
        from {
            stroke-dasharray: 0 100;
        }
        to {
            stroke-dasharray: 100 0;
        }
    }
`;
document.head.appendChild(style);

// Logout function (for use in other pages)
window.logout = function() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberedEmail');
    window.location.href = 'login.html';
};

// Get current user (for use in other pages)
window.getCurrentUser = function() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
};

// Check if user is logged in (for use in other pages)
window.isLoggedIn = function() {
    return sessionStorage.getItem('currentUser') !== null;
};

// Register new user (for signup page)
window.registerUser = function(userData) {
    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
        return {
            success: false,
            message: 'An account with this email already exists'
        };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        email: userData.email,
        password: userData.password,
        name: userData.name,
        memberSince: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('nikeUsers', JSON.stringify(users));
    
    return {
        success: true,
        user: newUser
    };
};

// Password strength checker
window.checkPasswordStrength = function(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Contains numbers
    if (/[0-9]/.test(password)) strength++;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    
    return {
        score: strength,
        level: strengthLevels[Math.min(strength, strengthLevels.length - 1)]
    };
};

// Session timeout (30 minutes)
let sessionTimeout;

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    
    if (currentUser) {
        sessionTimeout = setTimeout(() => {
            showMessage('Session expired. Please login again.', 'error');
            logout();
        }, 30 * 60 * 1000); // 30 minutes
    }
}

// Reset timeout on user activity
['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, resetSessionTimeout, { passive: true });
});

// Initialize session timeout
resetSessionTimeout();

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        authenticateUser,
        validateEmail,
        validatePassword,
        checkPasswordStrength
    };
}
    