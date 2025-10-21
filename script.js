// Main Chat Application
class HydroAI {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.initializeApp();
    }

    initializeApp() {
        // Initialize weather data
        updateWeatherData();
        
        // Initialize AI recommendations
        this.updateRecommendations();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Auto-update data every 30 seconds
        setInterval(() => {
            updateWeatherData();
            this.updateRecommendations();
        }, 30000);

        console.log('🤖 HOTTY HYDRA AI System Initialized');
    }

    setupEventListeners() {
        // Send message on button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Focus input on load
        this.userInput.focus();
    }

    sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        this.userInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get AI response after delay (simulate thinking)
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = getAIResponse(message);
            this.addMessage(response, 'ai');
            this.updateRecommendations();
        }, 1500);
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (sender === 'ai') {
            messageContent.innerHTML = `<strong>🤖 AI:</strong> ${content}`;
        } else {
            messageContent.innerHTML = `<strong>You:</strong> ${content}`;
        }
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.innerHTML = '<div class="message-content"><strong>🤖 AI:</strong> <span class="typing-dots">●●●</span></div>';
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Add typing animation
        const dots = typingDiv.querySelector('.typing-dots');
        let dotCount = 0;
        this.typingInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            dots.textContent = '●'.repeat(dotCount || 1);
        }, 500);
    }

    hideTypingIndicator() {
        clearInterval(this.typingInterval);
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    updateRecommendations() {
        const weather = getCurrentWeather();
        const recommendation = generateRecommendation(weather);
        
        document.getElementById('currentRecommendation').innerHTML = `
            <div class="rec-text">${recommendation.text}</div>
            <div class="rec-confidence">Confidence: <span id="confidence">${recommendation.confidence}</span>%</div>
            <div class="rec-savings">Expected Savings: $<span id="savings">${recommendation.savings}</span>/day</div>
        `;
    }
}

// Global Functions
function askQuestion(type) {
    const questions = {
        weather: "What's the optimal production schedule based on current weather?",
        maintenance: "What maintenance is needed for our equipment?",
        production: "Why did hydrogen production drop at 3 PM today?"
    };
    
    document.getElementById('userInput').value = questions[type];
    document.getElementById('sendBtn').click();
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message ai-message">
            <div class="message-content">
                <strong>🤖 AI:</strong> Hello! I'm your hydrogen plant AI assistant. Ask me anything about weather optimization, maintenance, or plant operations.
            </div>
        </div>
    `;
}

function generateRecommendation(weather) {
    const solar = weather.solar;
    const wind = weather.wind;
    const temp = weather.temperature;
    
    let text, confidence, savings;
    
    if (solar > 750 && wind > 12) {
        text = `Excellent renewable conditions! Start both electrolyzers for maximum 145 kg/hr production.`;
        confidence = 95;
        savings = 127;
    } else if (solar > 500 || wind > 8) {
        text = `Good conditions for single electrolyzer operation. Expected 85 kg/hr production.`;
        confidence = 87;
        savings = 89;
    } else {
        text = `Low renewable input. Consider battery storage or reduced production to 50 kg/hr.`;
        confidence = 82;
        savings = 45;
    }
    
    return { text, confidence, savings };
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hydroAI = new HydroAI();
});

// Export for use in other files
window.addMessage = (content, sender) => {
    if (window.hydroAI) {
        window.hydroAI.addMessage(content, sender);
    }
};
