// Configuration file for WealthEase-AI Forecasting & Budget Planning
// IMPORTANT: Replace with your actual API keys and client IDs

const CONFIG = {
    // Google OAuth Configuration
    GOOGLE_CLIENT_ID: '779523586683-ggj89c8velefopeplnh25oafr8obf2jp.apps.googleusercontent.com', // Replace with your Google OAuth Client ID
    
    // OpenAI API Configuration
    OPENAI_API_KEY: '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', // Replace with your OpenAI API Key
    OPENAI_API_URL: 'https://api.openai.com/v1/models',
    
    // Application Configuration
    APP_NAME: 'WealthEase-AI Forecasting & Budget Planning',
    VERSION: '1.0.0',
    
    // Storage Keys
    STORAGE_KEYS: {
        USER_INFO: 'wealthEase_userInfo',
        AUTH_TOKEN: 'wealthEase_authToken',
        API_STATUS: 'wealthEase_apiStatus'
    },
    
    // API Endpoints
    ENDPOINTS: {
        OPENAI_MODELS: 'https://api.openai.com/v1/models',
        OPENAI_CHAT: 'https://api.openai.com/v1/chat/completions'
    }
};

// Utility functions for configuration
const ConfigUtils = {
    // Get Google Client ID
    getGoogleClientId: () => {
        return CONFIG.GOOGLE_CLIENT_ID;
    },
    
    // Get OpenAI API Key
    getOpenAIKey: () => {
        return CONFIG.OPENAI_API_KEY;
    },
    
    // Validate configuration
    validateConfig: () => {
        const errors = [];
        
        if (!CONFIG.GOOGLE_CLIENT_ID || CONFIG.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
            errors.push('Google Client ID not configured');
        }
        
        if (!CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
            errors.push('OpenAI API Key not configured');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    // Show configuration errors
    showConfigErrors: () => {
        const validation = ConfigUtils.validateConfig();
        if (!validation.isValid) {
            console.warn('Configuration Errors:', validation.errors);
            // You can also show these errors in the UI if needed
            return validation.errors;
        }
        return [];
    }
};

// Initialize configuration check on load
document.addEventListener('DOMContentLoaded', () => {
    ConfigUtils.showConfigErrors();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ConfigUtils };
}
