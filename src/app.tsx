// app.tsx
import React, { useState } from 'react';
import { AIManager, APIType } from './AIManager'; // Adjust the import path as necessary

const user: string = "user";

function Greeting() {
    return (
        <div className="greeting-container">
            <span className='greeting-text'>Hello, </span>
            <span className='greeting-text greeting-text-user'>{user}</span>
            <span className='greeting-text'>.</span>
        </div>
    );
}

function MessageInputBox({ onSend }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <div className='message-input-container'>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                cols="30"
                rows="10"
                className='message-input'
            ></textarea>
            <button onClick={handleSend} className='message-input-send'>Send</button>
        </div>
    );
}

function Tool({ name, description }) {
    return (
        <div title={description} className='tool-select-chip-container'>
            <span className="tool-select-chip-text">{name}</span>
        </div>
    );
}

function ToolSelectBox() {
    return (
        <div className='tool-select-container'>
            <span className='tool-select-title'>What tools can I use here?</span>
            <div className='tool-select-list'>
                <Tool name="Co-writer" description="Co-writer description" />
                <Tool name="Translate" description="Translate description" />
                <Tool name="Document Parser" description="Document Parser description" />
                <Tool name="Calculate" description="Calculate description" />
                <Tool name="Web Access" description="Web Access description" />
                <Tool name="WebContainers" description="WebContainers description" />
            </div>
        </div>
    );
}

function ChatBox() {
    const [aiManager] = useState(new AIManager());
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
    

    const handleSendMessage = async (content) => {
        // Send user message
        aiManager.sendMessage("user", content);
        
        // Fetch AI response
        await aiManager.fetchResponse();
        
        // You can add logic here to update the UI with the new messages
        console.log(aiManager.activeChat.messages); // For debugging
    };

    return (
        <div className='chat-box'>
            <MessageInputBox onSend={handleSendMessage} />
            <ToolSelectBox />
        </div>
    );
}

function App() {
    return (
        <div className="container">
            <Greeting />
            <ChatBox />
        </div>
    );
}

export default App;
