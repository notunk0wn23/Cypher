import { AIManager } from './aiManager.js';
import { base } from './prompts.js';

const ai = new AIManager();

ai.API = {
    type: 'openai',
    key: import.meta.env.VITE_API_KEY,
    endpoint: 'https://api.groq.com/openai/v1',
    support: {
        temperature: false,
        top_p: false,
        max_tokens: false,
        max_length: false,
    }
}

await ai.get_models();
ai.prompt = base(ai.config.models.list, [
    `
    eval
    Runs a javascript evaluation and returns the result.
    Parameters:
    - expression: The expression to evaluate.
    
    Example:
    - expression: "1 + 1"
    - result: 2
    
    `
]);
ai.config.models.active = 'llama3-8b-8192';
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
  const existingMessages = chatMessages.children;
  const newMessages = ai.chats.active.messages;

  // Create a map of existing messages for easy lookup
  const existingMessageMap = {};
  Array.from(existingMessages).forEach((messageElement, index) => {
    existingMessageMap[index] = messageElement;
  });

  // Iterate over the new messages and update the DOM accordingly
  newMessages.forEach((message, index) => {
    const existingMessageElement = existingMessageMap[index];
    if (existingMessageElement) {
      // Update the existing message element
      existingMessageElement.textContent = message.content;
      if (message.role === 'user') {
        existingMessageElement.classList.add('user');
      } else if (message.role === 'assistant') {
        existingMessageElement.classList.add('assistant');
      }
    } else {
      // Create a new message element
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      if (message.role === 'user') {
        messageElement.classList.add('user');
      } else if (message.role === 'assistant') {
        messageElement.classList.add('assistant');
      }
      messageElement.textContent = message.content;
      chatMessages.appendChild(messageElement);
    }
  });

  // Remove any excess message elements
  while (existingMessages.length > newMessages.length) {
    chatMessages.removeChild(existingMessages[existingMessages.length - 1]);
  }
}

updateMessages();

// Send message on button click
document.getElementById('sendButton').addEventListener('click', async () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        ai.send_message('user', message);
        messageInput.value = '';
        updateMessages();
        await ai.get_response();
        updateMessages();
    }
});
window.ai = ai;