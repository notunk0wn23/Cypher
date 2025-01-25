"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
var APIType;
(function (APIType) {
    APIType[APIType["OpenAI"] = 0] = "OpenAI";
    APIType[APIType["HuggingFace"] = 1] = "HuggingFace";
    APIType[APIType["Google"] = 2] = "Google";
    APIType[APIType["Azure"] = 3] = "Azure";
    APIType[APIType["Pollinations"] = 4] = "Pollinations";
})(APIType || (APIType = {}));
class Chat {
    constructor() {
        this.messages = [];
        this.messages = [];
        this.id = (0, uuid_1.v4)();
    }
    addMessage(message) {
        this.messages.push(message);
    }
}
class AIManager {
    constructor() {
        this.FetchResponse = () => __awaiter(this, void 0, void 0, function* () {
            let response = "";
            switch (this.API.type) {
                case APIType.OpenAI:
                    const apiResponse = yield fetch(this.API.endpoint, {
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
                    });
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
        });
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
        };
        this.activeChat = new Chat();
    }
    _HandleAPICall() {
    }
}
