# WealthEase-AI Forecasting & Budget Planning

A modern web application for AI-powered financial forecasting and budget planning with Google OAuth authentication and OpenAI integration.

## 🚀 Features

- **Modern UI Design**: Elegant black and dark green color scheme with smooth transitions
- **Google OAuth Login**: Secure authentication using Google Sign-In
- **OpenAI Integration**: AI-powered financial forecasting capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time API Status**: Live monitoring of OpenAI API connection
- **Dashboard Interface**: Clean, intuitive dashboard with placeholder cards for future features

## 📁 Project Structure

```
WealthEase-AI/
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── styles.css          # Global styles and responsive design
├── auth.js            # Google OAuth authentication
├── openai-check.js    # OpenAI API integration
├── config.js          # Configuration and API keys
└── README.md          # This file
```

## 🛠️ Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add your domain to authorized origins (e.g., `http://localhost:3000` for local development)
7. Copy the Client ID

### 2. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (keep it secure!)

### 3. Configuration

1. Open `config.js`
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID
3. Replace `YOUR_OPENAI_API_KEY_HERE` with your actual OpenAI API key

```javascript
const CONFIG = {
    GOOGLE_CLIENT_ID: 'your-actual-google-client-id',
    OPENAI_API_KEY: 'your-actual-openai-api-key',
    // ... other config
};
```

## 🚀 Running the Application

### Local Development

1. **Using a simple HTTP server** (recommended):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have http-server installed)
   npx http-server
   ```

2. **Using Live Server** (VS Code extension):
   - Install the "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

3. **Open in browser**:
   - Navigate to `http://localhost:8000` (or the port shown by your server)
   - The application should load the login page

### Production Deployment

1. Upload all files to your web server
2. Ensure HTTPS is enabled (required for Google OAuth)
3. Update the authorized origins in Google Cloud Console with your production domain
4. Update `config.js` with production API keys

## 🎨 Design Features

### Color Scheme
- **Primary Black**: `#0a0a0a`
- **Dark Green**: `#1a2f1a`
- **Forest Green**: `#2d5a2d`
- **Gold**: `#d4af37`
- **Cream**: `#f5f5dc`
- **Dark Gray**: `#2c2c2c`

### UI Components
- Gradient backgrounds with glassmorphism effects
- Smooth hover animations and transitions
- Responsive grid layout for dashboard cards
- Status indicators with pulse animations
- Modern typography with Google Fonts

## 🔧 Technical Features

### Authentication
- Google OAuth 2.0 integration
- JWT token handling
- Persistent login sessions
- Secure logout functionality

### API Integration
- OpenAI API connection testing
- Real-time status monitoring
- Error handling and user feedback
- Future-ready for AI forecasting features

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables in production
- Enable HTTPS for production deployment
- Regularly rotate API keys
- Monitor API usage and costs

## 🚧 Future Enhancements

The application is designed with extensibility in mind. Future features can include:

- **Budget Tracking**: Real-time expense monitoring
- **AI Forecasting**: Predictive financial analytics
- **Investment Insights**: Portfolio recommendations
- **Goal Setting**: Financial milestone tracking
- **Reports**: Comprehensive financial reports
- **Data Visualization**: Interactive charts and graphs

## 🐛 Troubleshooting

### Common Issues

1. **Google OAuth not working**:
   - Check that your Client ID is correct
   - Ensure your domain is added to authorized origins
   - Make sure you're using HTTPS in production

2. **OpenAI API not connecting**:
   - Verify your API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure your API key has the necessary permissions

3. **Styling issues**:
   - Clear browser cache
   - Check that `styles.css` is loading properly
   - Verify file paths are correct

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all files are in the correct directory
3. Ensure your local server is running properly
4. Check that all API keys are configured correctly

## 📄 License

This project is for educational and personal use. Please ensure you comply with Google's and OpenAI's terms of service when using their APIs.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use cases.

---

**Note**: This application is ready to run immediately after configuring the API keys. All features are implemented using vanilla JavaScript, HTML, and CSS as requested.
