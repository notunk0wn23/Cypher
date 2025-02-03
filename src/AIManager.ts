import { parse } from "@babel/core";

export enum APIType {
  OpenAI,
  HuggingFace,
  Google,
  Azure,
  Pollinations,
}

interface APIConfig {
  type: APIType;
  key: string;
  endpoint: string;
}

interface ModelConfig {
  model: Model;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
}

export interface Message {
  role: string;
  content: string;
  timestamp: number;
  id: string;
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
    this.id = crypto.randomUUID();
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

export class AIManager {
  public API: APIConfig;
  public modelConfig: ModelConfig;
  public activeChat: Chat;

  public modelDB: ModelDatabase;
  private subscribers: any[];

  constructor() {
    this.API = {
      type: APIType.OpenAI,
      key: "",
      endpoint: "",
    };

    this.modelConfig = {
      model: {
        friendlyName: "",
        identifier: "",
        description: "",
      },
      temperature: 0.6,
      max_tokens: 4096,
      top_p: 0.9,
      frequency_penalty: 0.4,
    };

    // ModelDB is a way to represent a model by it's ID and get it. Simple.
    this.modelDB = new ModelDatabase();

    this.activeChat = new Chat();
    this.subscribers = [];
  }

  subscribe(callback: any) {
    this.subscribers.push(callback);
    console.log("registered callback");
  }

  // Unsubscribe when necessary
  unsubscribe(callback: any) {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }

  // Internal method to notify subscribers
  notifySubscribers(type: string, data: any) {
    this.subscribers.forEach((cb) => cb(type, data));
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
    const models = new Map<string, Model>();
    let response: any;
    let data: any;

    switch (this.API.type) {
      case APIType.OpenAI:
        response = await fetch(
          encodeURIComponent(this.API.endpoint + "/models"),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.API.key}`,
            },
          }
        );

        data = await response.json();
        for (let model of data.data) {
          if (this.getModelByID(model.id)) {
            models.set(model.id, this.getModelByID(model.id) as Model);
          } else {
            models.set(model.id, {
              friendlyName: model.id,
              identifier: model.id,
              description:
                "Model owned by " +
                model.owned_by +
                " with a context window of " +
                model.context_window,
            });
          }
        }
      case APIType.HuggingFace:
        break;
      case APIType.Google:
        break;
      case APIType.Azure:
        break;
      case APIType.Pollinations:
        response = await fetch(this.API.endpoint + "/models", {
          method: "GET",
        });
        data = await response.json();
        for (let model of data) {
          if (this.getModelByID(model.name)) {
            models.set(model.name, this.getModelByID(model.name) as Model);
          } else {
            models.set(model.name, {
              friendlyName: model.name,
              identifier: model.name,
              description: model.description,
            });
          }
        }
        break;
    }

    return models;
  }

  sendMessage(role: string, content: string, timestamp: number = Date.now()) {
    this.activeChat.messages.push({
      role: role,
      content: content,
      timestamp: timestamp,
      id: crypto.randomUUID(),
    });
  }

  async fetchResponse() {
    console.log("=== START AI RESPONSE ===");
    console.log("Model: " + this.modelConfig.model.identifier);

    const messages = this.activeChat.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    let response: string = "";
    let apiResponse: any;
    let data: any;
    let reader: any;
    let decoder: TextDecoder;
    let done: boolean = false;
    let streamed: boolean = false;

    switch (this.API.type) {
      case APIType.OpenAI:
        console.log({
          model: this.modelConfig.model.identifier,
          messages: messages,
          temperature: this.modelConfig.temperature,
          max_tokens: this.modelConfig.max_tokens,
          top_p: this.modelConfig.top_p,
          frequency_penalty: this.modelConfig.frequency_penalty,
          stream: true,
        });
        streamed = true;
        console.log("API Type: OpenAI");
        console.log("SENDING REQUEST");
        apiResponse = await fetch(this.API.endpoint + "/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.API.key}`,
          },
          body: JSON.stringify({
            model: this.modelConfig.model.identifier,
            messages: messages,
            temperature: this.modelConfig.temperature,
            max_tokens: this.modelConfig.max_tokens,
            top_p: this.modelConfig.top_p,
            stream: true,
          }),
        });

        this.sendMessage("assistant", "");

        reader = apiResponse.body.getReader();
        decoder = new TextDecoder("utf-8");
        response = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && line.trim() !== "data: [DONE]") {
              const jsonString = line.substring(6); // Strip "data: "
              try {
                const parsedChunk = JSON.parse(jsonString);
                console.log(
                  "Processed chunk:",
                  parsedChunk.choices[0].delta.content
                );
                response += parsedChunk.choices[0].delta.content;
                this.activeChat.messages[
                  this.activeChat.messages.length - 1
                ].content += parsedChunk.choices[0].delta.content;
                this.notifySubscribers("messageChunkStreamed", {
                  chunk: parsedChunk.choices[0].delta.content,
                  messages: this.activeChat.messages,
                });
                // Handle the parsed chunk here
              } catch (err) {
                console.error("Error parsing chunk:", err);
              }
            }
          }
        }

        break;
      case APIType.HuggingFace:
        streamed = true;
        apiResponse = await fetch(
          this.API.endpoint +
            "/models/" +
            this.modelConfig.model.identifier +
            "/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.API.key}`,
            },
            body: JSON.stringify({
              model: this.modelConfig.model.identifier,
              messages: messages,
              temperature: this.modelConfig.temperature,
              max_tokens: this.modelConfig.max_tokens,
              top_p: this.modelConfig.top_p,
              stream: true,
            }),
          }
        );

        this.sendMessage("assistant", "");

        reader = apiResponse.body.getReader();
        decoder = new TextDecoder("utf-8");
        response = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && line.trim() !== "data: [DONE]") {
              const jsonString = line.substring(6); // Strip "data: "
              try {
                const parsedChunk = JSON.parse(jsonString);
                console.log(
                  "Processed chunk:", 
                  parsedChunk.choices[0].delta.content
                );
                if (parsedChunk.choices[0].delta.content && parsedChunk.choices[0].delta.content != "undefined") {
                  response += parsedChunk.choices[0].delta.content;

                  this.activeChat.messages[
                    this.activeChat.messages.length - 1
                  ].content += parsedChunk.choices[0].delta.content;
                  this.notifySubscribers("messageChunkStreamed", {
                    chunk: parsedChunk.choices[0].delta.content,
                    messages: this.activeChat.messages,
                  });  
                } else {
                  console.log("Not sending last chunk (undefined)")
                }

                // Handle the parsed chunk here
              } catch (err) {
                console.error("Error parsing chunk:", err);
              }
            }
          }
        }

        break;
      case APIType.Google:
        break;
      case APIType.Azure:
        break;
      case APIType.Pollinations:
        // polinations sadly has no support o
        apiResponse = await fetch(this.API.endpoint + "/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.modelConfig.model,
            messages: this.activeChat.messages,
          }),
        });
        data = await apiResponse.json();
        console.log("Recived response from API: " + JSON.stringify(data));
        response = data.choices[0].message.content;
        break;
    }

    console.log("Finished recieving or streaming response!");
    console.log("Response: " + response);
    console.log("Sending response to user (unless it was streamed)");
    if (!streamed) {
      this.sendMessage("assistant", response);
    }
    this.notifySubscribers("messageFinish", response);
    console.log("=== END OF AI REPONSE ===");
  }
}
