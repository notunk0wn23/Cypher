import { ChatBox } from "./ChatBox";
import { Greeting } from "./Greeting";
import { ChatMessages } from "./Messages";

export function NewChatMenu({ handleSendMessages }) {
  return (
    <>
      <Greeting />
      <ChatBox onSendMessage={handleSendMessages} />
    </>
  );
}

export function ChatMenu({ handleSendMessages, messages }) {
  return (
    <div className="chat-menu">
      <ChatMessages messages={messages} />
      <ChatBox onSendMessage={handleSendMessages} />
    </div>
  );
}