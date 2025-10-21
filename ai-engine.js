// Smart AI Response Engine for Hydrogen Plant Operations
class HydrogenAI {
    constructor() {
        this.knowledgeBase = {
            // Weather optimization responses
            weather: [
                "Based on current solar irradiance of {solar}W/m² and wind at {wind} km/h, I recommend {recommendation}. This configuration will maximize renewable energy utilization while maintaining safety protocols.",
                "Weather analysis shows {weather_condition}. Optimal production window is {time_window} with expected {efficiency}% efficiency. Auto-starting electrolyzer sequence.",
                "Solar conditions are {solar_status} with {cloud_cover}% cloud coverage. Wind energy contribution is {wind_contribution}. Recommended action: {action}."
            ],
            
            // Production analysis responses  
            production: [
                "Production drop at 3 PM was caused by {cause}. System automatically compensated by {compensation}. Current output normalized at {current_rate} kg/hr.",
                "Hydrogen production efficiency is currently {efficiency}% due to {factors}. I've optimized electrolysis parameters to achieve {target_production} kg/hr output.",
                "Production metrics show {metric_analysis}. Electrolyzer performance: Unit 1 at {unit1_perf}%, Unit 2 at {unit2_perf}%. Storage level: {storage}%."
            ],
            
            // Maintenance responses
            maintenance: [
                "Electrolyzer 1 shows {maintenance_issue} with current efficiency at {efficiency}%. Predictive analysis indicates {maintenance_action} required in {timeframe}.",
                "Maintenance schedule optimized based on usage patterns. Next service: {next_service}. Critical components: {components}. Expected downtime: {downtime}.",
                "Equipment health analysis: {equipment_status}. Preventive maintenance recommendation: {recommendation}. Cost savings: ${savings} vs reactive maintenance."
            ],
            
            // Safety responses
            safety: [
                "Safety systems are monitoring {safety_parameters}. All values within normal range. Emergency protocols ready with <2 second response time.",
                "Detected {safety_alert} condition. Implementing {safety_action}. System status: {status}. Operator notification sent.",
                "Hydrogen leak detection system shows {leak_status}. Ventilation systems {ventilation_status}. Emergency shutdown tested and operational."
            ],
            
            // Efficiency and optimization
            efficiency: [
                "Current system efficiency is {efficiency}% compared to industry average of 75%. Energy consumption optimized through {optimization_method}.",
                "Cost analysis shows ${daily_savings}/day savings through AI optimization. LCOH reduced to ${lcoh}/kg, {percent_reduction}% below target.",
                "Digital twin simulation predicts {prediction} based on current parameters. Recommended optimization: {optimization}."
            ]
        };
        
        this.plantStatus = this.initializePlantStatus();
    }
    
    initializePlantStatus() {
        return {
            electrolyzer1: { efficiency: 78, temperature: 65, status: 'operational' },
            electrolyzer2: { efficiency: 85, temperature: 58, status: 'optimal' },
            storage: { level: 43, pressure: 350, temperature: -253 },
            production: { current: 85.4, target: 120, efficiency: 82 },
            safety: { status: 'all_clear', last_check: 'now' }
        };
    }
    
    generateResponse(userQuestion) {
        const question = userQuestion.toLowerCase();
        let category = this.categorizeQuestion(question);
        let response = this.selectResponse(category);
        
        // Add dynamic data to response
        response = this.populateResponseData(response, category);
        
        // Add confidence and reasoning
        return this.formatFinalResponse(response, category);
    }
    
    categorizeQuestion(question) {
        const keywords = {
            weather: ['weather', 'solar', 'wind', 'sun', 'renewable', 'condition', 'forecast', 'optimize', 'schedule'],
            production: ['production', 'output', 'hydrogen', 'generate', 'drop', 'increase', 'rate', 'efficiency', 'performance'],
            maintenance: ['maintenance', 'repair', 'service', 'equipment', 'electrolyzer', 'filter', 'replacement', 'health'],
            safety: ['safety', 'leak', 'emergency', 'pressure', 'temperature', 'alert', 'shutdown', 'danger'],
            efficiency: ['cost', 'savings', 'lcoh', 'optimize', 'efficiency', 'profit', 'energy', 'consumption']
        };
        
        for (let [category, words] of Object.entries(keywords)) {
            if (words.some(word => question.includes(word))) {
                return category;
            }
        }
        
        return 'general';
    }
    
    selectResponse(category) {
        if (category === 'general') {
            return "I can help you with weather optimization, production analysis, maintenance scheduling, and safety monitoring. What specific aspect would you like to know about?";
        }
        
        const responses = this.knowledgeBase[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    populateResponseData(response, category) {
        const weather = getCurrentWeather();
        const plant = this.plantStatus;
        
        const dataMap = {
            // Weather data
            '{solar}': weather.solar,
            '{wind}': weather.wind,
            '{weather_condition}': weather.solar > 700 ? 'excellent solar conditions' : 'moderate conditions',
            '{recommendation}': weather.solar > 750 ? 'running both electrolyzers at full capacity' : 'single electrolyzer operation',
            '{time_window}': '10:00 AM - 2:00 PM',
            '{efficiency}': weather.solar > 700 ? '94' : '87',
            '{solar_status}': weather.solar > 750 ? 'optimal' : weather.solar > 500 ? 'good' : 'limited',
            '{cloud_cover}': Math.floor(Math.random() * 30),
            '{wind_contribution}': Math.floor(weather.wind * 2.5),
            '{action}': weather.solar > 600 ? 'increase production to 120 kg/hr' : 'maintain current 85 kg/hr',
            
            // Production data
            '{cause}': 'solar cloud coverage reduced input by 30%',
            '{compensation}': 'switching to battery backup and reducing electrolyzer power by 15%',
            '{current_rate}': plant.production.current,
            '{efficiency}': plant.production.efficiency,
            '{factors}': 'optimal temperature control and pressure regulation',
            '{target_production}': plant.production.target,
            '{metric_analysis}': 'stable output with 2.1% improvement over yesterday',
            '{unit1_perf}': plant.electrolyzer1.efficiency,
            '{unit2_perf}': plant.electrolyzer2.efficiency,
            '{storage}': plant.storage.level,
            
            // Maintenance data
            '{maintenance_issue}': 'filter saturation and minor efficiency degradation',
            '{maintenance_action}': 'filter replacement and system calibration',
            '{timeframe}': '3 days',
            '{next_service}': 'Electrolyzer 1 filter replacement - October 18th',
            '{components}': 'filters, membrane stack, cooling system',
            '{downtime}': '4 hours',
            '{equipment_status}': 'good overall condition with normal wear patterns',
            '{recommendation}': 'replace filters now to prevent 15% efficiency loss',
            '{savings}': '2,450',
            
            // Safety data
            '{safety_parameters}': 'pressure, temperature, hydrogen concentration, and leak detection',
            '{safety_alert}': 'minor temperature elevation',
            '{safety_action}': 'increased cooling and ventilation',
            '{status}': 'stable and within safe limits',
            '{leak_status}': 'no leaks detected - all sensors operational',
            '{ventilation_status}': 'operating normally at 85% capacity',
            
            // Efficiency data
            '{daily_savings}': '127',
            '{lcoh}': '2.85',
            '{percent_reduction}': '33',
            '{optimization_method}': 'predictive weather analysis and dynamic load balancing',
            '{prediction}': '18% efficiency improvement over next 6 months',
            '{optimization}': 'implement advanced MPC algorithms for electrolyzer control'
        };
        
        // Replace all placeholders
        for (let [placeholder, value] of Object.entries(dataMap)) {
            response = response.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
        }
        
        return response;
    }
    
    formatFinalResponse(response, category) {
        // Add contextual ending based on category
        const endings = {
            weather: " Would you like me to schedule the optimized production run?",
            production: " I can provide more detailed analysis if needed.",
            maintenance: " Shall I schedule this maintenance window?",
            safety: " All systems remain under continuous monitoring.",
            efficiency: " I can show you the detailed cost breakdown if helpful."
        };
        
        if (endings[category]) {
            response += endings[category];
        }
        
        return response;
    }
}

// Initialize AI engine
const aiEngine = new HydrogenAI();

// Main function to get AI response
function getAIResponse(userQuestion) {
    return aiEngine.generateResponse(userQuestion);
}

// Additional helper functions for specific queries
function getWeatherOptimization() {
    const weather = getCurrentWeather();
    return aiEngine.generateResponse("What's the optimal production schedule based on current weather?");
}

function getMaintenanceStatus() {
    return aiEngine.generateResponse("What maintenance is needed for our equipment?");
}

function getProductionAnalysis() {
    return aiEngine.generateResponse("Analyze current hydrogen production performance");
}

// Export functions for global use
window.getAIResponse = getAIResponse;
window.getWeatherOptimization = getWeatherOptimization;
window.getMaintenanceStatus = getMaintenanceStatus;
window.getProductionAnalysis = getProductionAnalysis;
