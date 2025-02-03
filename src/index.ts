import { AIManager, APIType } from './AIManager';

const aiManager = new AIManager();

aiManager.sendMessage("user", "hello");
aiManager.fetchResponse();

// for debugging purposes
window.ai = aiManager