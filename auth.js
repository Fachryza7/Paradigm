// Authentication module for WealthEase-AI Forecasting & Budget Planning

class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.checkExistingAuth();
        
        // Initialize Google Sign-In
        this.initGoogleSignIn();

        // Initialize manual login form handler
        this.initManualLogin();
    }

    // Initialize Google Sign-In
    initGoogleSignIn() {
        if (typeof google !== 'undefined' && google.accounts) {
            const clientId = ConfigUtils.getGoogleClientId();
            
            if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
                console.error('Google Client ID not configured properly');
                this.showMessage('Google Sign-In not configured. Please check your setup.', 'error');
                return;
            }
            
            google.accounts.id.initialize({
                client_id: clientId,
                callback: this.handleCredentialResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
            });
            
            console.log('Google Sign-In initialized successfully');
        } else {
            // Keep UI clean: do not show a top-of-page error if the library hasn't loaded yet
            console.warn('Google Sign-In library not loaded');
        }
    }

    // Initialize manual login form
    initManualLogin() {
        const form = document.getElementById('manual-login-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            // Basic validation
            if (!email || !password) {
                this.showMessage('Please enter email and password.', 'error');
                return;
            }

            // Demo-only authentication (no backend). Replace with real API call when ready.
            this.handleManualLogin(email, password);
        });
    }

    // Handle manual login (demo only)
    handleManualLogin(email, password) {
        // Simple demo rule: any non-empty email/password accepted.
        // In production, call your backend API to validate credentials.
        const demoUser = {
            id: `local-${Date.now()}`,
            email: email,
            name: email.split('@')[0],
            picture: '',
            loginTime: new Date().toISOString(),
            provider: 'local'
        };

        this.user = demoUser;
        this.isAuthenticated = true;
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_INFO, JSON.stringify(this.user));
        localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, 'local-demo-token');

        this.showMessage('Login successful! Redirecting to dashboard...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    }

    // Handle Google OAuth response
    handleCredentialResponse(response) {
        try {
            // Decode the JWT token (simplified version)
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            this.user = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                loginTime: new Date().toISOString()
            };

            this.isAuthenticated = true;
            
            // Store user info in localStorage
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER_INFO, JSON.stringify(this.user));
            localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.credential);
            
            // Show success message
            this.showMessage('Login successful! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error handling credential response:', error);
            this.showMessage('Login failed. Please try again.', 'error');
        }
    }

    // Check if user is already authenticated
    checkExistingAuth() {
        const storedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_INFO);
        const storedToken = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        
        if (storedUser && storedToken) {
            try {
                this.user = JSON.parse(storedUser);
                this.isAuthenticated = true;
                
                // Update user name in dashboard if we're on dashboard page
                if (window.location.pathname.includes('dashboard.html')) {
                    this.updateUserDisplay();
                }
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                this.logout();
            }
        }
    }

    // Sign in with Google (fallback method)
    signInWithGoogle() {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            try {
                google.accounts.id.prompt();
            } catch (error) {
                console.error('Error prompting Google Sign-In:', error);
                this.showMessage('Failed to open Google Sign-In. Please try again.', 'error');
            }
        } else {
            console.error('Google Sign-In not available');
            this.showMessage('Google Sign-In is not available. Please check your internet connection and refresh the page.', 'error');
        }
    }

    // Logout user
    logout() {
        this.user = null;
        this.isAuthenticated = false;
        
        // Clear stored data
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_INFO);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.API_STATUS);
        
        // Sign out from Google
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.disableAutoSelect();
        }
        
        // Redirect to login page
        window.location.href = 'index.html';
    }

    // Update user display in dashboard
    updateUserDisplay() {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && this.user) {
            userNameElement.textContent = this.user.name || this.user.email;
        }
    }

    // Show message to user
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // Insert message at the top of the page
        const body = document.body;
        body.insertBefore(messageElement, body.firstChild);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    // Check if user is authenticated (for protected pages)
    requireAuth() {
        if (!this.isAuthenticated) {
            this.showMessage('Please log in to access this page.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return false;
        }
        return true;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Check authentication status
    getAuthStatus() {
        return {
            isAuthenticated: this.isAuthenticated,
            user: this.user
        };
    }
}

// Global functions for HTML onclick events
function signInWithGoogle() {
    if (window.authManager) {
        window.authManager.signInWithGoogle();
    }
}

function handleCredentialResponse(response) {
    if (window.authManager) {
        window.authManager.handleCredentialResponse(response);
    }
}

function logout() {
    if (window.authManager) {
        window.authManager.logout();
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    
    // If on dashboard page, check authentication
    if (window.location.pathname.includes('dashboard.html')) {
        if (!window.authManager.requireAuth()) {
            return;
        }
        
        // Update user display
        window.authManager.updateUserDisplay();
    }
});

// Handle page visibility changes (for token refresh if needed)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.authManager) {
        // Re-check authentication status
        window.authManager.checkExistingAuth();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
