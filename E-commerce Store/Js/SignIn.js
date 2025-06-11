// Load existing users from localStorage
let users = JSON.parse(localStorage.getItem('nikeUsers')) || [];

// Current form step
let currentStep = 1;
const totalSteps = 3;

// Form elements
const signupForm = document.getElementById('signupForm');
const messageContainer = document.getElementById('message-container');
const progressFill = document.getElementById('progressFill');
const submitBtn = document.getElementById('submitBtn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupEventListeners();
    
    // Update progress bar
    updateProgressBar();
});

// Setup event listeners
function setupEventListeners() {
    // Form submission
    signupForm.addEventListener('submit', handleSignup);
    
    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    togglePassword.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
    
    // Real-time validation
    setupRealtimeValidation();
    
    // Password strength checker
    document.getElementById('password').addEventListener('input', checkPasswordStrength);
    
    // Email check on blur
    document.getElementById('email').addEventListener('blur', checkExistingEmail);
}

// Real-time validation
function setupRealtimeValidation() {
    // First Name
    document.getElementById('firstName').addEventListener('blur', function() {
        validateField('firstName', this.value.trim().length >= 2, 'First name must be at least 2 characters');
    });
    
    // Last Name
    document.getElementById('lastName').addEventListener('blur', function() {
        validateField('lastName', this.value.trim().length >= 2, 'Last name must be at least 2 characters');
    });
    
    // Email
    document.getElementById('email').addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField('email', emailRegex.test(this.value), 'Please enter a valid email address');
    });
    
    // Password
    document.getElementById('password').addEventListener('blur', function() {
        validateField('password', this.value.length >= 6, 'Password must be at least 6 characters');
    });
    
    // Birthdate
    document.getElementById('birthdate').addEventListener('blur', function() {
        const birthDate = new Date(this.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        validateField('birthdate', age >= 13, 'You must be at least 13 years old to create an account');
    });
    
    // Country
    document.getElementById('country').addEventListener('change', function() {
        validateField('country', this.value !== '', 'Please select a country');
    });
}

// Validate field
function validateField(fieldId, isValid, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!isValid) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        return false;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
        return true;
    }
}

// Check if email already exists
async function checkExistingEmail() {
    const email = document.getElementById('email').value.trim();
    const errorElement = document.getElementById('email-error');
    
    if (!email) return;
    
    // Check if email exists in users array
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
        document.getElementById('email').classList.add('error');
        errorElement.textContent = 'An account with this email already exists';
        showMessage('This email is already registered. Please sign in or use a different email.', 'warning');
        return false;
    }
    
    return true;
}

// Check password strength
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
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
    
    // Update UI
    strengthFill.className = 'strength-fill';
    
    if (password.length === 0) {
        strengthText.textContent = 'Password strength';
        strengthFill.style.width = '0';
    } else if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (strength <= 4) {
        strengthFill.classList.add('fair');
        strengthText.textContent = 'Fair password';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
}

// Navigation functions
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            // Hide current step
            document.getElementById(`step${currentStep}`).classList.remove('active');
            
            // Show next step
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            
            // Update progress bar
            updateProgressBar();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        // Show previous step
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        
        // Update progress bar
        updateProgressBar();
    }
}

// Update progress bar
function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
}

// Validate current step
function validateCurrentStep() {
    let isValid = true;
    
    switch(currentStep) {
        case 1:
            // Validate personal info
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            if (!validateField('firstName', firstName.length >= 2, 'First name must be at least 2 characters')) {
                isValid = false;
            }
            
            if (!validateField('lastName', lastName.length >= 2, 'Last name must be at least 2 characters')) {
                isValid = false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!validateField('email', emailRegex.test(email), 'Please enter a valid email address')) {
                isValid = false;
            }
            
            if (!validateField('password', password.length >= 6, 'Password must be at least 6 characters')) {
                isValid = false;
            }
            
            // Check if email exists
            if (isValid && users.find(user => user.email.toLowerCase() === email.toLowerCase())) {
                showMessage('This email is already registered. Please sign in instead.', 'error');
                isValid = false;
            }
            
            break;
            
        case 2:
            // Validate additional info
            const birthdate = document.getElementById('birthdate').value;
            const country = document.getElementById('country').value;
            const gender = document.querySelector('input[name="gender"]:checked');
            
            if (!birthdate) {
                validateField('birthdate', false, 'Please enter your date of birth');
                isValid = false;
            } else {
                const birthDate = new Date(birthdate);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (!validateField('birthdate', age >= 13, 'You must be at least 13 years old')) {
                    isValid = false;
                }
            }
            
            if (!validateField('country', country !== '', 'Please select a country')) {
                isValid = false;
            }
            
            if (!gender) {
                document.getElementById('gender-error').textContent = 'Please select a gender';
                isValid = false;
            }
            
            break;
            
        case 3:
            // Validate terms
            const terms = document.getElementById('terms').checked;
            if (!terms) {
                document.getElementById('terms-error').textContent = 'You must agree to the terms and conditions';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showMessage('Please fill in all required fields correctly', 'error');
    }
    
    return isValid;
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    
    // Validate all steps
    if (!validateCurrentStep()) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        birthdate: document.getElementById('birthdate').value,
        country: document.getElementById('country').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        newsletter: document.getElementById('newsletter').checked,
        terms: document.getElementById('terms').checked
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create new user
    const newUser = {
        id: Date.now(),
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthdate: formData.birthdate,
        country: formData.country,
        gender: formData.gender,
        newsletter: formData.newsletter,
        memberSince: new Date().toISOString(),
        memberNumber: `NIKE${Date.now().toString().slice(-8)}`
    };
    
    // Add user to database
    users.push(newUser);
    localStorage.setItem('nikeUsers', JSON.stringify(users));
    
    // Show success modal
    showSuccessModal(newUser);
    
    setLoadingState(false);
}

// Show message
function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
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
    if (isLoading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        document.querySelector('.btn-text').style.display = 'none';
        document.querySelector('.btn-loader').style.display = 'inline-block';
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        document.querySelector('.btn-text').style.display = 'inline-block';
        document.querySelector('.btn-loader').style.display = 'none';
    }
}

// Show success modal
function showSuccessModal(user) {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    
    // Update modal content with user info
    const modalContent = modal.querySelector('.modal-content');
    modalContent.querySelector('h2').textContent = `Welcome to Nike, ${user.firstName}!`;
    modalContent.querySelector('p').textContent = `Your member number is ${user.memberNumber}`;
}

// Redirect to login
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
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
    
    .loading .btn-text {
        display: none;
    }
    
    .loading .btn-loader {
        display: inline-block !important;
    }
`;
document.head.appendChild(style);

// Make functions available globally
window.nextStep = nextStep;
window.previousStep = previousStep;
window.redirectToLogin = redirectToLogin;