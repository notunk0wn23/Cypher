import { AIManager, APIType } from './utils/AIManager';

const aiManager = new AIManager();

aiManager.sendMessage("user", "hello");
aiManager.fetchResponse();

// for debugging purposes
window.ai = aiManager