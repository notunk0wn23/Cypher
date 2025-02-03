import { useState } from "react";
import { AIManager, APIType, Message } from "./AIManager";

// Components
import { ChatMenu, NewChatMenu } from "./components/Menus";

// just temp till I can get an account system
const user: string = "user";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiManager, _] = useState<AIManager>(new AIManager());

  aiManager.subscribe((type: string, data: any) => {
    switch (type) {
      case "messageChunkStreamed":
        setMessages([...aiManager.activeChat.messages]);
        break;
    }
  });
  aiManager.API = {
    type: APIType.OpenAI,
    key: import.meta.env.VITE_GROQ_API_KEY as string,
    endpoint: "https://api.groq.com/openai/v1",
  };

  // aiManager.modelDB.models = await aiManager.getModels();
  aiManager.modelConfig = {
    model: {
      friendlyName: "llama",
      identifier: "llama-3.3-70b-versatile",
      description: "DeepSeek's 1st reasoning model.",
    },
    temperature: 0.6,
    max_tokens: 16384,
    top_p: 0.9,
    frequency_penalty: 0.4,
  };

  const handleSendMessage = async (message: string) => {
    console.log("new user message: " + message);
    aiManager.sendMessage("user", message);
    setMessages([...aiManager.activeChat.messages]); // Update UI with new messages
    aiManager.fetchResponse();
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
