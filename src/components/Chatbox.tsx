import React, { useState, useRef, useEffect } from "react";
import ContentEditable from 'react-contenteditable';
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

export function ChatBox({ onSendMessage }) {
  return (
    <div className="chat-box">
      <MessageInputBox onSendMessage={onSendMessage} />
      <ToolSelectBox />
    </div>
  );
}
