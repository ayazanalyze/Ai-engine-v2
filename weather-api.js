// Weather API Integration for Hydrogen Plant Optimization
class WeatherService {
    constructor() {
        this.currentWeatherData = null;
        this.apiKey = null; // For demo, we'll use mock data
        this.lastUpdate = null;
        this.updateInterval = 300000; // 5 minutes
        
        // Initialize with mock data
        this.initializeMockWeather();
        
        // Try to get real weather data (fallback to mock if fails)
        this.updateWeatherData();
    }
    
    initializeMockWeather() {
        // Realistic weather data for Delhi/Mumbai (typical hydrogen plant locations)
        this.mockWeatherData = {
            temperature: 28 + Math.random() * 8, // 28-36°C
            solar_irradiance: 650 + Math.random() * 300, // 650-950 W/m²
            wind_speed: 8 + Math.random() * 12, // 8-20 km/h
            humidity: 45 + Math.random() * 25, // 45-70%
            cloud_cover: Math.floor(Math.random() * 40), // 0-40%
            visibility: 8 + Math.random() * 2, // 8-10 km
            weather_condition: 'clear',
            forecast_confidence: 88 + Math.random() * 10 // 88-98%
        };
        
        this.currentWeatherData = this.mockWeatherData;
    }
    
    async updateWeatherData() {
        try {
            // Try real API first (OpenWeatherMap free tier)
            await this.getRealWeatherData();
        } catch (error) {
            console.log('Using mock weather data for demo');
            this.generateRealisticMockData();
        }
        
        this.lastUpdate = new Date();
        this.updateUI();
    }
    
    async getRealWeatherData() {
        // Free weather API - no key needed for basic data
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata');
        
        if (response.ok) {
            const data = await response.json();
            this.currentWeatherData = {
                temperature: Math.round(data.current.temperature_2m),
                solar_irradiance: this.estimateSolarIrradiance(data.current),
                wind_speed: Math.round(data.current.wind_speed_10m * 3.6), // m/s to km/h
                humidity: data.current.relative_humidity_2m,
                cloud_cover: 20, // Estimated
                visibility: 9,
                weather_condition: this.getWeatherCondition(data.current),
                forecast_confidence: 92
            };
        } else {
            throw new Error('API request failed');
        }
    }
    
    generateRealisticMockData() {
        // Simulate realistic weather changes over time
        const now = new Date();
        const hour = now.getHours();
        
        // Solar irradiance based on time of day
        let solarBase;
        if (hour >= 6 && hour <= 8) solarBase = 300; // Morning
        else if (hour >= 9 && hour <= 15) solarBase = 800; // Peak hours
        else if (hour >= 16 && hour <= 18) solarBase = 400; // Evening
        else solarBase = 0; // Night
        
        // Add some randomness
        const variation = (Math.random() - 0.5) * 0.3;
        
        this.currentWeatherData = {
            temperature: Math.round(28 + Math.sin(hour * Math.PI / 12) * 8 + variation * 5),
            solar_irradiance: Math.max(0, Math.round(solarBase + variation * 200)),
            wind_speed: Math.round(10 + Math.sin(hour * Math.PI / 8) * 5 + variation * 8),
            humidity: Math.round(55 + Math.cos(hour * Math.PI / 12) * 15),
            cloud_cover: Math.floor(Math.random() * 30),
            visibility: Math.round(8.5 + Math.random() * 1.5),
            weather_condition: this.generateWeatherCondition(),
            forecast_confidence: Math.round(88 + Math.random() * 10)
        };
    }
    
    estimateSolarIrradiance(currentData) {
        // Estimate solar irradiance based on time and conditions
        const now = new Date();
        const hour = now.getHours();
        
        let baseIrradiance;
        if (hour >= 6 && hour <= 8) baseIrradiance = 400;
        else if (hour >= 9 && hour <= 15) baseIrradiance = 850;
        else if (hour >= 16 && hour <= 18) baseIrradiance = 350;
        else baseIrradiance = 0;
        
        // Adjust for humidity (clouds)
        const humidityFactor = 1 - (currentData.relative_humidity_2m / 200);
        return Math.round(baseIrradiance * humidityFactor);
    }
    
    getWeatherCondition(currentData) {
        if (currentData.relative_humidity_2m > 80) return 'cloudy';
        if (currentData.wind_speed_10m > 15) return 'windy';
        return 'clear';
    }
    
    generateWeatherCondition() {
        const conditions = ['clear', 'partly_cloudy', 'cloudy', 'windy'];
        const weights = [0.5, 0.3, 0.15, 0.05]; // Favor clear weather
        
        const random = Math.random();
        let sum = 0;
        for (let i = 0; i < conditions.length; i++) {
            sum += weights[i];
            if (random < sum) return conditions[i];
        }
        return 'clear';
    }
    
    updateUI() {
        // Update weather display
        document.getElementById('temperature').textContent = `${this.currentWeatherData.temperature}°C`;
        document.getElementById('solar').textContent = `${this.currentWeatherData.solar_irradiance} W/m²`;
        document.getElementById('wind').textContent = `${this.currentWeatherData.wind_speed} km/h`;
        
        // Update weather condition styling
        this.updateWeatherStyling();
    }
    
    updateWeatherStyling() {
        const weatherCard = document.querySelector('.weather-card');
        const solar = this.currentWeatherData.solar_irradiance;
        
        // Remove existing weather classes
        weatherCard.classList.remove('excellent-conditions', 'good-conditions', 'poor-conditions');
        
        // Add appropriate class based on solar conditions
        if (solar > 750) {
            weatherCard.classList.add('excellent-conditions');
        } else if (solar > 400) {
            weatherCard.classList.add('good-conditions');
        } else {
            weatherCard.classList.add('poor-conditions');
        }
    }
    
    getCurrentWeather() {
        return this.currentWeatherData;
    }
    
    getWeatherSummary() {
        const weather = this.currentWeatherData;
        const solar = weather.solar_irradiance;
        const wind = weather.wind_speed;
        
        let summary = {
            overall: 'moderate',
            recommendation: 'standard_operation',
            renewable_potential: 'medium'
        };
        
        if (solar > 750 && wind > 12) {
            summary = {
                overall: 'excellent',
                recommendation: 'maximize_production',
                renewable_potential: 'high'
            };
        } else if (solar > 500 || wind > 8) {
            summary = {
                overall: 'good',
                recommendation: 'normal_production',
                renewable_potential: 'medium'
            };
        } else {
            summary = {
                overall: 'limited',
                recommendation: 'reduce_production',
                renewable_potential: 'low'
            };
        }
        
        return summary;
    }
}

// Initialize weather service
const weatherService = new WeatherService();

// Global functions for other scripts
function updateWeatherData() {
    weatherService.updateWeatherData();
}

function getCurrentWeather() {
    return weatherService.getCurrentWeather();
}

function getWeatherSummary() {
    return weatherService.getWeatherSummary();
}

// Auto-update weather every 5 minutes
setInterval(() => {
    weatherService.updateWeatherData();
}, weatherService.updateInterval);

// Add weather condition CSS
const weatherCSS = `
.weather-card.excellent-conditions {
    border-left: 4px solid #00ff88;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.weather-card.good-conditions {
    border-left: 4px solid #00a8ff;
    box-shadow: 0 0 20px rgba(0, 168, 255, 0.2);
}

.weather-card.poor-conditions {
    border-left: 4px solid #ff6b35;
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.2);
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = weatherCSS;
document.head.appendChild(style);

// Export for global use
window.weatherService = weatherService;
window.updateWeatherData = updateWeatherData;
window.getCurrentWeather = getCurrentWeather;
window.getWeatherSummary = getWeatherSummary;
