import React, { useState } from "react";
import { AIManager, APIType, Message } from "./AIManager";

// just temp till I can get an account system
const user: string = "user";

function Greeting() {
  return (
    <div className="greeting-container">
      <span className="greeting-text">Hello, </span>
      <span className="greeting-text greeting-text-user">{user}</span>
      <span className="greeting-text">.</span>
    </div>
  );
}

function MessageInputBox({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage(""); // Clear input after sending
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents newline
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <textarea
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown} // Listen for Enter
        placeholder="Type a message..."
      ></textarea>
      <button className="message-input-send" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

function Tool({ name, description }) {
  return (
    <div title={description} className="tool-select-chip-container">
      <span className="tool-select-chip-text">{name}</span>
    </div>
  );
}

function ToolSelectBox() {
  return (
    <div className="tool-select-container">
      <span className="tool-select-title">What tools can I use here?</span>
      <div className="tool-select-list">
        <Tool name="Co-writer" description="Co-writer description" />
        <Tool name="Translate" description="Translate description" />
        <Tool
          name="Document Parser"
          description="Document Parser description"
        />
        <Tool name="Calculate" description="Calculate description" />
        <Tool name="Web Access" description="Web Access description" />
        <Tool name="WebContainers" description="WebContainers description" />
      </div>
    </div>
  );
}

function ChatMessages({ messages }) {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message message-${msg.role}`}>
          <span>{msg.content}</span>
        </div>
      ))}
    </div>
  );
}

function ChatBox({ onSendMessage }) {
  return (
    <div className="chat-box">
      <MessageInputBox onSendMessage={onSendMessage} />
      <ToolSelectBox />
    </div>
  );
}

function NewChatMenu({ handleSendMessages }) {
  return (
    <>
      <Greeting />
      <ChatBox onSendMessage={handleSendMessages} />
    </>
  );
}

function ChatMenu({ handleSendMessages, messages }) {
    return (
      <div className="chat-menu">
        <ChatMessages messages={messages}/>
        <ChatBox onSendMessage={handleSendMessages} />
      </div>
    );
  }
  

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiManager, _] = useState<AIManager>(new AIManager());

  aiManager.API = {
    type: APIType.Pollinations,
    key: import.meta.env.VITE_HF_API_KEY as string,
    endpoint: "https://text.pollinations.ai",
  };

  // aiManager.modelDB.models = await aiManager.getModels();
  aiManager.modelConfig = {
    model: {
      friendlyName: "ChatGPT 4o",
      identifier: "openai-large",
      description: "OpenAI's next-generation of GPT-4",
    },
    temperature: 0.6,
    max_tokens: 4096,
    top_p: 0.9,
    frequency_penalty: 0.4,
  };

  const handleSendMessage = async (message: string) => {
    console.log("new user message: " + message)
    aiManager.sendMessage("user", message);
    setMessages([...aiManager.activeChat.messages]); // Update UI with new messages
    await aiManager.fetchResponse();
    setMessages([...aiManager.activeChat.messages]); // Update UI with new messages
  };

  return (
    <div className="container">
        {messages.length === 0 ? (
            <NewChatMenu handleSendMessages={handleSendMessage} />
        ) : (
            <ChatMenu handleSendMessages={handleSendMessage} messages={messages} />
        )}
    </div>
  );
}

export default App;
