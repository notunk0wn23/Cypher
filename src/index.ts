import { AIManager, APIType } from './AIManager';

const aiManager = new AIManager();
aiManager.API = {
    type: APIType.HuggingFace,
    key: import.meta.env.VITE_HF_API_KEY as string,
    endpoint: "https://api-inference.huggingface.co"
}

console.log(aiManager.API.key)

// aiManager.modelDB.models = await aiManager.getModels();
aiManager.modelConfig = {
    model: {
        friendlyName: "DeepSeek R1",
        identifier: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
        description: "DeepSeek AI's First-gen reasoning model."
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