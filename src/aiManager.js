class Chat {
    constructor(base) {
        this.messages = base ? [{ role: 'system', content: base }] : [];
    }
}

export class AIManager {
    constructor() {
        this.API = {
            type: 'openai',
            key: 'import.meta.env.VITE_API_KEY',
            endpoint: '',
            support: {
                temperature: false,
                top_p: false,
                max_tokens: false,
                max_length: false,
            }
        };
        this.chats = {
            active: null,
            list: []
        };
        this.config = {
            models: {
                active: '',
                list: []
            },
            temperature: 0.5,
            max_tokens: 100,
            max_length: 100,
            top_p: 0.9
        };
        this.prompt = '';
    }

    async get_models() {
        try {
            const endpoint = this.API.type === 'openai' ? '/models' : '/api/models';
            const response = await fetch(`${this.API.endpoint}${endpoint}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${this.API.key}` }
            });

            if (!response.ok) {
                throw new Error(`Error fetching models: ${response.statusText}`);
            }

            const data = await response.json();
            this.config.models.list = data?.data || [];
        } catch (error) {
            console.error('Failed to fetch models:', error);
        }
    }

    new_chat() {
        this.chats.active = new Chat(this.prompt);
    }

    send_message(type, content, toolcall = false, toolcall_data = false) {
        if (!['user', 'system', 'assistant', 'toolcall_response'].includes(type)) {
            throw new Error('Unsupported message type');
        }

        const message = { role: type, content };

        if (type === 'assistant' && toolcall) {
            message.toolcall = toolcall;
            message.toolcall_data = toolcall_data;
        } else if (type === 'toolcall_response') {
            message.data = content;
        }

        this.chats.active.messages.push(message);
    }

    fetch_standardized_messages() {
        return [
            { role: 'system', content: this.prompt },
            ...this.chats.active.messages.map((msg, idx) => ({
                role: idx % 2 === 0 ? 'user' : 'assistant',
                content: JSON.stringify(msg)
            }))
        ];
    }

    async get_response() {
        if (!['openai', 'huggingface', 'google'].includes(this.API.type)) {
            throw new Error('Unsupported API type');
        }

        let response;

        switch (this.API.type) {
            case 'openai':
                response = await this._handle_openai_response();
                break;
            case 'huggingface':
                response = await this._handle_huggingface_response();
                break;
            case 'google':
                response = await this._handle_google_response();
                break;
        }

        this.send_message('assistant', response);
    }

    async _handle_openai_response() {
        const body = {
            model: this.config.models.active,
            messages: this.fetch_standardized_messages(),
            ...this._filter_supported_config()
        };

        const response = await fetch(`${this.API.endpoint}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.API.key}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async _handle_huggingface_response() {
        const response = await fetch(`${this.API.endpoint}/${this.config.models.active}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.API.key}`
            },
            body: JSON.stringify({
                inputs: this.fetch_standardized_messages(),
                parameters: this._filter_supported_config()
            })
        });

        const data = await response.json();
        return data;
    }

    async _handle_google_response() {
        const contents = this.chats.active.messages
            .filter(msg => msg.role !== 'system')
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' : msg.role,
                parts: [{ text: msg.content }]
            }));

        const response = await fetch(`${encodeURIComponent(`${this.API.endpoint}/models/${this.config.models.active}:generateContent?key=${this.API.key}`)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.API.key}`
            },
            body: JSON.stringify({
                system_instruction: { parts: { text: this.chats.active.messages[0].content } },
                contents,
                generationConfig: this._filter_supported_config()
            })
        });

        return response;
    }

    _filter_supported_config() {
        return Object.fromEntries(
            Object.entries(this.config).filter(([key]) => this.API.support[key])
        );
    }

    tool_call_handler(toolcall, toolcall_data) {
        console.log(toolcall, toolcall_data);
        if (toolcall === 'eval') {
            this.send_message('toolcall_response', eval(toolcall_data.expression));
        }
    }
}
