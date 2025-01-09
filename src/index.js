import { AIManager } from './aiManager.js';
import { base } from './prompts.js';

const ai = new AIManager();

ai.API = {
    type: 'openai',
    key: import.meta.env.VITE_API_KEY,
    endpoint: 'https://api.groq.com/openai/v1'
}

await ai.get_models();
const modelIds = ai.config.models.list.map(model => model.id);
ai.prompt = base(modelIds);

ai.new_chat();



// Greeting
const sidebarGreeting = document.getElementById('sidebarGreeting');

function updateGreeting() {
    const hours = new Date().getHours();
    let timeOfDay;

    if (hours < 12) {
        timeOfDay = 'morning';
    } else if (hours < 18) {
        timeOfDay = 'afternoon';
    } else {
        timeOfDay = 'evening';
    }

    sidebarGreeting.textContent = `Good ${timeOfDay}.`;
}

updateGreeting();

// Message UI
const chatMessages = document.getElementById('chatMessages');

function updateMessages() {
    ai.chats.active.messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
    
        if (message.role === 'user') {
            messageElement.classList.add('user');
        } else if (message.role === 'assistant') {
            messageElement.classList.add('assistant');
        }
    
        messageElement.textContent = message.content;
    
        chatMessages.appendChild(messageElement);
    });
}

updateMessages();


window.ai = ai;

document.rootElement.classList.toggle('dark-theme');
