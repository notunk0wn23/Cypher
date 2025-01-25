import { AIManager, APIType } from './AIManager';

const aiManager = new AIManager();
aiManager.API = {
    type: APIType.OpenAI,
    key: import.meta.env.VITE_OPENAI_KEY,
    endpoint: import.meta.env.VITE_OPENAI_ENDPOINT
}

aiManager.modelConfig = {
    model: "",
    temperature: 0.6,
    max_tokens: 4096,
    top_p: 0.9,
    frequency_penalty: 0.4
}


// for debugging purposes
window.ai = aiManager