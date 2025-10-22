/**
 * OpenAI Integration Backend untuk WealthEase AI Finance
 * Handles communication with OpenAI API for transaction analysis
 */

const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting untuk OpenAI API
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
        error: 'Too many AI analysis requests, please try again later.'
    }
});

/**
 * Format transaction data untuk OpenAI analysis
 */
function formatTransactionData(transactions, userProfile) {
    const recentTransactions = transactions.slice(-30); // Last 30 transactions
    
    // Calculate financial metrics
    const totalBalance = calculateTotalBalance(transactions);
    const monthlyIncome = calculateMonthlyIncome(transactions);
    const monthlyExpenses = calculateMonthlyExpenses(transactions);
    const spendingCategories = analyzeSpendingCategories(transactions);
    const spendingPattern = analyzeSpendingPattern(transactions);
    
    const data = {
        userProfile: {
            name: userProfile.name || 'User',
            totalBalance: totalBalance,
            monthlyIncome: monthlyIncome,
            monthlyExpenses: monthlyExpenses,
            savingsRate: monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100) : 0
        },
        transactions: recentTransactions.map(t => ({
            date: t.date,
            type: t.type,
            amount: t.amount,
            category: t.category,
            description: t.description || 'No description'
        })),
        analysis: {
            totalTransactions: transactions.length,
            averageTransactionAmount: calculateAverageTransaction(transactions),
            spendingCategories: spendingCategories,
            spendingPattern: spendingPattern,
            incomeVsExpense: monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome * 100) : 0,
            largestExpense: findLargestExpense(transactions),
            mostFrequentCategory: findMostFrequentCategory(transactions)
        }
    };
    
    return `Analyze this financial data and provide comprehensive insights:

USER PROFILE:
- Name: ${data.userProfile.name}
- Current Balance: $${data.userProfile.totalBalance.toFixed(2)}
- Monthly Income: $${data.userProfile.monthlyIncome.toFixed(2)}
- Monthly Expenses: $${data.userProfile.monthlyExpenses.toFixed(2)}
- Savings Rate: ${data.userProfile.savingsRate.toFixed(1)}%

RECENT TRANSACTIONS (Last ${data.transactions.length}):
${data.transactions.map(t => 
    `- ${t.date}: ${t.type.toUpperCase()} $${t.amount.toFixed(2)} (${t.category}) - ${t.description}`
).join('\n')}

FINANCIAL ANALYSIS:
- Total Transactions: ${data.analysis.totalTransactions}
- Average Transaction: $${data.analysis.averageTransactionAmount.toFixed(2)}
- Income vs Expense Ratio: ${data.analysis.incomeVsExpense.toFixed(1)}%
- Largest Single Expense: $${data.analysis.largestExpense.toFixed(2)}
- Most Frequent Category: ${data.analysis.mostFrequentCategory}
- Spending Pattern: ${data.analysis.spendingPattern}

SPENDING CATEGORIES BREAKDOWN:
${Object.entries(data.analysis.spendingCategories).map(([category, amount]) => 
    `- ${category}: $${amount.toFixed(2)}`
).join('\n')}

Please provide a comprehensive analysis in JSON format with these exact keys:
{
    "analysis": "Detailed analysis of spending patterns, financial health, and trends",
    "recommendations": "Specific actionable recommendations for improving financial health",
    "predictions": {
        "nextWeekBalance": estimated_balance_next_week,
        "nextMonthBalance": estimated_balance_next_month,
        "trend": "bullish/bearish/neutral",
        "summary": "Brief summary of future financial outlook"
    },
    "warnings": "Any financial warnings or red flags",
    "score": {
        "financialHealth": score_out_of_100,
        "spendingDiscipline": score_out_of_100,
        "savingsRate": score_out_of_100,
        "volatility": volatility_percentage,
        "confidence": confidence_percentage
    }
}

Focus on:
1. Spending pattern analysis and trends
2. Budget optimization recommendations
3. Financial health assessment
4. Future balance predictions based on current trends
5. Specific actionable advice for improvement
6. Risk assessment and warnings

Be specific, actionable, and provide concrete numbers for predictions.`;
}

/**
 * Calculate total balance from transactions
 */
function calculateTotalBalance(transactions) {
    return transactions.reduce((total, transaction) => {
        if (transaction.type === 'income') {
            return total + transaction.amount;
        } else {
            return total - transaction.amount;
        }
    }, 0);
}

/**
 * Calculate monthly income
 */
function calculateMonthlyIncome(transactions) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return t.type === 'income' && 
                   transactionDate.getMonth() === currentMonth &&
                   transactionDate.getFullYear() === currentYear;
        })
        .reduce((total, t) => total + t.amount, 0);
}

/**
 * Calculate monthly expenses
 */
function calculateMonthlyExpenses(transactions) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return t.type === 'expense' && 
                   transactionDate.getMonth() === currentMonth &&
                   transactionDate.getFullYear() === currentYear;
        })
        .reduce((total, t) => total + t.amount, 0);
}

/**
 * Analyze spending categories
 */
function analyzeSpendingCategories(transactions) {
    const categories = {};
    
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
    
    return categories;
}

/**
 * Analyze spending pattern
 */
function analyzeSpendingPattern(transactions) {
    const expenses = transactions.filter(t => t.type === 'expense');
    const recentExpenses = expenses.slice(-10);
    const olderExpenses = expenses.slice(-20, -10);
    
    if (recentExpenses.length === 0 || olderExpenses.length === 0) {
        return 'Insufficient data';
    }
    
    const recentAvg = recentExpenses.reduce((sum, t) => sum + t.amount, 0) / recentExpenses.length;
    const olderAvg = olderExpenses.reduce((sum, t) => sum + t.amount, 0) / olderExpenses.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 10) return 'Increasing spending';
    if (change < -10) return 'Decreasing spending';
    return 'Stable spending';
}

/**
 * Calculate average transaction amount
 */
function calculateAverageTransaction(transactions) {
    if (transactions.length === 0) return 0;
    return transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length;
}

/**
 * Find largest expense
 */
function findLargestExpense(transactions) {
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return 0;
    return Math.max(...expenses.map(t => t.amount));
}

/**
 * Find most frequent spending category
 */
function findMostFrequentCategory(transactions) {
    const categories = {};
    
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + 1;
        });
    
    const mostFrequent = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)[0];
    
    return mostFrequent ? mostFrequent[0] : 'No data';
}

/**
 * Parse AI response and validate JSON
 */
function parseAIResponse(response) {
    try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }
        
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate required fields
        const requiredFields = ['analysis', 'recommendations', 'predictions', 'warnings', 'score'];
        for (const field of requiredFields) {
            if (!parsed[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        return parsed;
    } catch (error) {
        console.error('Error parsing AI response:', error);
        
        // Return fallback response
        return {
            analysis: "Unable to parse AI response. Please try again.",
            recommendations: "Check your transaction data and try the analysis again.",
            predictions: {
                nextWeekBalance: 0,
                nextMonthBalance: 0,
                trend: "neutral",
                summary: "Unable to generate predictions"
            },
            warnings: "AI analysis failed. Please verify your data.",
            score: {
                financialHealth: 50,
                spendingDiscipline: 50,
                savingsRate: 50,
                volatility: 0,
                confidence: 0
            }
        };
    }
}

/**
 * Main AI analysis endpoint
 */
router.post('/analyze-transactions', aiLimiter, async (req, res) => {
    try {
        const { transactions, userProfile } = req.body;
        
        // Validate input
        if (!transactions || !Array.isArray(transactions)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid transactions data'
            });
        }
        
        if (transactions.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No transactions to analyze'
            });
        }
        
        // Check OpenAI API key
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                success: false,
                error: 'OpenAI API key not configured'
            });
        }
        
        // Format data for OpenAI
        const analysisPrompt = formatTransactionData(transactions, userProfile);
        
        console.log('Sending request to OpenAI...');
        
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a professional financial advisor AI. Analyze transaction data and provide detailed, actionable insights. Always respond with valid JSON format as requested."
                },
                {
                    role: "user",
                    content: analysisPrompt
                }
            ],
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1500,
            temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
        });
        
        const aiResponse = completion.choices[0].message.content;
        console.log('OpenAI Response received');
        
        // Parse and validate response
        const analysis = parseAIResponse(aiResponse);
        
        // Log successful analysis
        console.log('AI Analysis completed successfully');
        
        res.json({
            success: true,
            analysis: analysis,
            rawResponse: aiResponse,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        // Handle specific OpenAI errors
        if (error.code === 'insufficient_quota') {
            return res.status(429).json({
                success: false,
                error: 'OpenAI API quota exceeded. Please try again later.'
            });
        }
        
        if (error.code === 'invalid_api_key') {
            return res.status(401).json({
                success: false,
                error: 'Invalid OpenAI API key'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to analyze transactions',
            details: error.message
        });
    }
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        openaiConfigured: !!process.env.OPENAI_API_KEY
    });
});

/**
 * Test endpoint for development
 */
router.post('/test', async (req, res) => {
    try {
        const testPrompt = "Respond with: 'OpenAI integration is working correctly'";
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: testPrompt
                }
            ],
            max_tokens: 50
        });
        
        res.json({
            success: true,
            message: completion.choices[0].message.content,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Apply routes
app.use('/api/ai', router);

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`WealthEase AI API server running on port ${PORT}`);
    console.log(`OpenAI API Key configured: ${!!process.env.OPENAI_API_KEY}`);
});

module.exports = app;
