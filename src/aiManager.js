class Chat {
    constructor(base) {
        this.messages = [];
        if (base) this.messages.push({role: 'system', content: base});
    }
}

export class AIManager {
    constructor() {
         this.API = {
            type: 'openai',
            key: 'import.meta.env.VITE_API_KEY',
            endpoint: '',
            support: {
                temp: true,
                top_p: true,
                max_tokens: true,
                max_length: true,
                tools: true
            }
         }
         this.chats = {
            active: null,
            list: []
         }
         this.config = {
            models: {
                active: '',
                list: []
            },
            temperature: 0.5,
            max_tokens: 100,
            max_length: 100,
            top_p: 0.9
        }

        this.prompt = '';
    }

    async get_models() {
        let response;
        switch (this.API.type) {
            case 'openai':
                response = await fetch(this.API.endpoint + '/models', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.API.key}`
                    }
                });
                break;
            case 'huggingface':
                response = await fetch(this.API.endpoint + '/api/models', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.API.key}`
                    }
                });
                break;
            default:
                throw new Error('Unsupported API type');
        }
        const data = await response.json();
        console.log(data);
        this.config.models.list = data.data;
    }

    new_chat() {
        this.chats.active = new Chat(this.basePrompt);
    }

    async send_message(type, content, toolcall=false, toolcall_data=false) {
        if (type === 'user' || type === 'system') {
            this.chats.active.messages.push({type, content});
        } else if (type === 'assistant') {
            /*if (toolcall) {
                this.tool_call_handler(toolcall, toolcall_data);
            }*/
           let message = {role: 'assistant', content};
           if (toolcall) {
                message.toolcall = toolcall;
                message.toolcall_data = toolcall_data;
            }
            this.chats.active.messages.push(message);
        } else if (type === 'toolcall_response') {
            this.chats.active.messages.push({role: 'toolcall_response', data: content});
        } else {
            throw new Error('Unsupported message type');
        }
    }

    async get_response() {
        let response;

        const messages = [{role: 'system', content: this.prompt}];
        this.chats.active.messages.forEach((message, index) => {
            if (index % 2 === 0) {
                messages.push({role: 'user', content: JSON.stringify(message)});
            } else {
                messages.push({role: 'assistant', content: JSON.stringify(message)});
            }
        });

        console.log(messages);
        switch (this.API.type) {
            case 'openai':
                const body = {
                    model: this.config.models.active,
                    messages: messages
                };

                /*
                    Long story short; Not all APIs use the full OpenAI Spec, like Pollinations.
                    API.support has everything set to true by default to make it easy for people already using the latest version.
                    IF YOU HAVE A FEATURE THAT THE API CANT USE, TURN IT OFF IN SUPPORT.
                */
                for (let key in this.API.support) {
                    if (this.API.support.hasOwnProperty(key)) {
                        body[key] = this.API.support[key] ? this.config[key] : undefined;
                    }
                }

                response = await fetch(this.API.endpoint + '/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.API.key}`
                    },
                    body: JSON.stringify(body)
                });
                const data = await response.json();
                console.log(data);
                response = data.choices[0].message.content;
                break;
            case 'huggingface':
                response = await fetch(this.API.endpoint + "/" + this.config.models.active, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.API.key}`
                    },
                    body: JSON.stringify({
                        inputs: this.chats.active.messages,
                        parameters: {
                            max_length: this.config.max_length,
                            max_tokens: this.config.max_tokens,
                            temperature: this.config.temperature,
                            top_p: this.config.top_p
                        }
                    })
                });
                response = await response.json();
                break;
            default:
                throw new Error('Unsupported API type');
                break;
        }

        const message = JSON.parse(response);

        if (message.toolcall) {
            this.tool_call_handler(message.toolcall, message.toolcall_data);
            this.send_message('assistant', message.content, message.toolcall, message.toolcall_data);
        } else {
            this.send_message('assistant', message.content);
        }
    }
    
    tool_call_handler(toolcall, toolcall_data) {
        console.log(toolcall);
        console.log(toolcall_data);
        if (toolcall === 'eval') {
            this.send_message('toolcall_response', eval(toolcall_data.expression));
        }
    }
}