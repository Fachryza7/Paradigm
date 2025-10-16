// OpenAI API integration for WealthEase-AI Forecasting & Budget Planning

class OpenAIManager {
    constructor() {
        this.apiKey = null;
        this.isConnected = false;
        this.status = 'checking'; // 'checking', 'connected', 'disconnected', 'error'
        this.init();
    }

    init() {
        // Only initialize if we're on the dashboard page
        if (window.location.pathname.includes('dashboard.html')) {
            console.log('OpenAI Manager initializing...');
            this.apiKey = ConfigUtils.getOpenAIKey();
            console.log('API Key loaded:', this.apiKey ? 'Yes' : 'No');
            this.checkConnection();
        }
    }

    // Check OpenAI API connection
    async checkConnection() {
        const statusIndicator = document.getElementById('openai-indicator');
        const statusText = document.getElementById('openai-text');
        const connectBtn = document.getElementById('connect-btn');
        
        try {
            // Update UI to show checking status
            this.updateStatusUI('checking', 'Checking OpenAI connection...');
            
            // Validate API key format
            if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
                throw new Error('OpenAI API key not configured');
            }
            
            // Test API connection
            const response = await this.testAPIConnection();
            
            if (response.ok) {
                this.isConnected = true;
                this.status = 'connected';
                this.updateStatusUI('connected', 'OpenAI Connected');
                this.storeConnectionStatus(true);
                
                console.log('OpenAI API connection successful');
            } else {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('OpenAI API connection failed:', error);
            this.isConnected = false;
            this.status = 'disconnected';
            this.updateStatusUI('disconnected', 'OpenAI Not Connected');
            this.showConnectButton();
            this.storeConnectionStatus(false);
        }
    }

    // Test API connection by making a simple request
    async testAPIConnection() {
        try {
            const response = await fetch(CONFIG.ENDPOINTS.OPENAI_MODELS, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response;
        } catch (error) {
            console.error('Network error during API test:', error);
            throw error;
        }
    }

    // Update status UI elements
    updateStatusUI(status, message) {
        const statusIndicator = document.getElementById('openai-indicator');
        const statusText = document.getElementById('openai-text');
        const connectBtn = document.getElementById('connect-btn');
        const recheckBtn = document.getElementById('recheck-btn');
        
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${status}`;
        }
        
        if (statusText) {
            statusText.textContent = message;
        }
        
        if (connectBtn) {
            connectBtn.style.display = status === 'disconnected' ? 'block' : 'none';
        }
        
        if (recheckBtn) {
            recheckBtn.style.display = status === 'disconnected' ? 'block' : 'none';
        }
    }

    // Show connect button for manual connection
    showConnectButton() {
        const connectBtn = document.getElementById('connect-btn');
        if (connectBtn) {
            connectBtn.style.display = 'block';
            connectBtn.onclick = () => this.handleConnectClick();
        }
    }

    // Handle connect button click
    handleConnectClick() {
        // Show configuration instructions
        this.showConfigInstructions();
    }

    // Show configuration instructions
    showConfigInstructions() {
        const message = `
            To connect OpenAI API:
            1. Get your API key from https://platform.openai.com/api-keys
            2. Open config.js file
            3. Replace 'YOUR_OPENAI_API_KEY_HERE' with your actual API key
            4. Refresh this page
            
            Current status: API key not configured
        `;
        
        if (window.authManager) {
            window.authManager.showMessage(message, 'error');
        } else {
            alert(message);
        }
    }

    // Store connection status in localStorage
    storeConnectionStatus(isConnected) {
        const statusData = {
            isConnected: isConnected,
            lastChecked: new Date().toISOString(),
            status: this.status
        };
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.API_STATUS, JSON.stringify(statusData));
    }

    // Get stored connection status
    getStoredConnectionStatus() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.API_STATUS);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error parsing stored API status:', error);
            return null;
        }
    }

    // Make OpenAI API request (for future use)
    async makeAPIRequest(endpoint, data) {
        if (!this.isConnected) {
            throw new Error('OpenAI API not connected');
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('OpenAI API request failed:', error);
            throw error;
        }
    }

    // Example method for future AI forecasting features
    async generateFinancialForecast(prompt) {
        try {
            const response = await this.makeAPIRequest(CONFIG.ENDPOINTS.OPENAI_CHAT, {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a financial advisor AI assistant. Provide helpful, accurate financial advice and forecasting based on the user\'s input.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generating financial forecast:', error);
            throw error;
        }
    }

    // Get connection status
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            status: this.status,
            lastChecked: this.getStoredConnectionStatus()?.lastChecked
        };
    }

    // Recheck connection
    async recheckConnection() {
        await this.checkConnection();
    }
}

// Global functions for HTML interactions
function connectOpenAI() {
    if (window.openAIManager) {
        window.openAIManager.handleConnectClick();
    }
}

function recheckOpenAI() {
    if (window.openAIManager) {
        window.openAIManager.recheckConnection();
    }
}

// Initialize OpenAI manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        // Wait a bit for all scripts to load
        setTimeout(() => {
            window.openAIManager = new OpenAIManager();
        }, 100);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenAIManager;
}
