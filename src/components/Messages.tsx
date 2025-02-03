import ReactMarkdown from "react-markdown";
import { useRef, useEffect } from "react";


import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Optional: include a theme
import 'prismjs/plugins/autoloader/prism-autoloader.min.js'; // Load the auto loader

// Load common languages
Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/components/';
Prism.plugins.autoloader.loadLanguages([
  'python', 'java', 'javascript', 'cpp', 'c', 'ruby', 'swift', 'php', 
  'go', 'rust', 'typescript', 'markup', 'css', 'sql', 'bash', 'kotlin', 
  'objectivec', 'r', 'dart', 'lua', 'haskell', 'perl', 'csharp', 'shell', 
  'markdown', 'dockerfile', 'yaml', 'json'
]);


function Message({ role, content }) {
  useEffect(() => {
    // Highlight all code blocks after the markdown is rendered
    Prism.highlightAll();
  }, [content]);

  return (
    <div className={`message message-${role}`}>
      <ReactMarkdown> 
        {content}
      </ReactMarkdown>
    </div>
  );
}


export function ChatMessages({ messages }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <Message role={msg.role} content={msg.content} key={index} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
