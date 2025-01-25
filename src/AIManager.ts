import { v4 as uuidv4 } from 'uuid';

enum APIType {
    OpenAI,
    HuggingFace,
    Google,
    Azure,
    Pollinations
}

interface APIConfig {
    type: APIType;
    key: string;
    endpoint: string;
}

interface ModelConfig {
    model: string,
    temperature: number,
    max_tokens: number,
    top_p: number,
    frequency_penalty: number,
}

interface Message {
    role: string;
    content: string;
}

interface Model {
    friendlyName: string;
    identifier: string;
    description: string;
}


class Chat {
    public messages: Message[] = [];
    public id: string;

    constructor() {
        this.messages = [];
        this.id = uuidv4();
    }

    addMessage(message: Message) {
        this.messages.push(message);
    }
}

export class ModelDatabase {
    public models: Map<string, Model> = new Map();
    public modelKeys: { [key: string]: string } = {};

    addModel(key: string, model: Model) {
        this.models.set(key, model);
    }

    addModelKey(key: string, modelKey: string) {
        if (this.models.has(key)) {
            this.modelKeys[key] = modelKey;
        }
    } 
}

class AIManager {
    public API: APIConfig;
    public modelConfig: ModelConfig;
    public activeChat: Chat;

    public modelDB: ModelDatabase;

    constructor() {
        this.API = {
            type: APIType.OpenAI,
            key: "",
            endpoint: ""
        };

        this.modelConfig = {
            model: "",
            temperature: 0.6,
            max_tokens: 4096,
            top_p: 0.9,
            frequency_penalty: 0.4
        }


        // ModelDB is a way to represent a model by it's ID and get it. Simple.
        this.modelDB = new ModelDatabase();

        this.activeChat = new Chat()
    }

    getModelByID(alias: string): Model | undefined {
        const cannonicalID = this.modelDB.modelKeys[alias];
        if (cannonicalID) {
            return this.modelDB.models.get(cannonicalID);
        } else {
            return undefined;
        }
    }

    async getModels() {
        let models: Model[] = [];
        let response: any; 
        let data: any;

        switch (this.API.type) {
            case APIType.OpenAI:
                response = await fetch(encodeURIComponent(this.API.endpoint + "/models"), {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.API.key}`
                    }
                });

                data = await response.json();
                for (let model of data.data) {
                    if (this.getModelByID(model.id)) {
                        models.push(this.getModelByID(model.id) as Model);
                    } else {
                        models.push({
                            friendlyName: model.id,
                            identifier: model.id,
                            description: "Model owned by " + model.owned_by + " with a context window of " + model.context_window,
                        });
                    }
                }
            case APIType.HuggingFace:
                response = await fetch("https://api.huggingface.co/v1/models?search=" + encodeURIComponent(this.modelConfig.model), {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                data = await response.json();
                for (let model of data.results) {
                    models.push({
                        friendlyName: model.modelId.split("/")[1],
                        name: model.modelId,
                        description: model.description,
                    });
                }
                return models;
            case APIType.Google:
                break;
            case APIType.Azure:
                break;
            case APIType.Pollinations:
                response = await fetch(this.API.endpoint + "/models", {
                    
                })
                break;
                
        }
    }

    FetchResponse = async () => {
        let response: string = "";
        switch (this.API.type) {
            case APIType.OpenAI:
                const apiResponse : any = await fetch(this.API.endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.API.key}`
                    },
                    body: JSON.stringify({
                        model: this.modelConfig.model,
                        messages: this.activeChat.messages,
                        temperature: this.modelConfig.temperature,
                        max_tokens: this.modelConfig.max_tokens,
                        top_p: this.modelConfig.top_p,
                        frequency_penalty: this.modelConfig.frequency_penalty
                    })
                })
                break;
            case APIType.HuggingFace:
                break;
            case APIType.Google:
                break;
            case APIType.Azure:
                break;
            case APIType.Pollinations:
                break;
        }
    }
    
    _HandleAPICall() {

    }
}