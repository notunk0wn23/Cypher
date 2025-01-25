import { AIManager, APIType } from './AIManager';

const aiManager = new AIManager();
aiManager.API = {
    type: APIType.Pollinations,
    key: "",
    endpoint: "https://text.pollinations.ai"
}

aiManager.modelDB.models = await aiManager.getModels();
aiManager.modelConfig = {
    model: {
        friendlyName: "ChatGPT 4o",
        identifier: "openai-large",
        description: "OpenAI's Latest flagship model."
    },
    temperature: 0.6,
    max_tokens: 4096,
    top_p: 0.9,
    frequency_penalty: 0.4
}

aiManager.sendMessage("user", "hello");
aiManager.fetchResponse();

// for debugging purposes
window.ai = aiManager