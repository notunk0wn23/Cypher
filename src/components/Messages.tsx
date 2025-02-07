// React
import { useRef, useEffect } from "react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faRotateRight } from "@fortawesome/free-solid-svg-icons";

// Message Markdown Formatting
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/autoloader/prism-autoloader.min.js";

// Load common languages
Prism.plugins.autoloader.languages_path =
  "https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/components/";
  Prism.plugins.autoloader.loadLanguages(["python", "javascript", "typescript", "html", "css"]);

function ActionButton({ onClick, icon }) {
  return (
    <button onClick={onClick} className="message-action">
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

function CodeBlock({ inline, className, children }) {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <div className="code-block">
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  ) : (
    <code className={className}>{children}</code>
  );
}

function Message({ role, content }) {
  useEffect(() => {
    // Highlight all code blocks after the markdown is rendered
    Prism.highlightAll();
  }, [content]);

  return (
    <div className={`message message-${role}`}>
      <div className="message-content">
        <ReactMarkdown
          components={{
            code: CodeBlock,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      <div className="message-actions">
      </div>
    </div>
  );
}

export function ChatMessages({ messages }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function copyToClipboard(text: string) {
    try {
      // Check if the browser supports the navigator.clipboard API
      if (!navigator.clipboard) {
        throw new Error("Clipboard API not supported");
      }
  
      // Check if the page is served over HTTPS
      if (window.location.protocol !== "https:") {
        throw new Error("HTTPS required");
      }
  
      // Create a button to trigger the copy action
      const copyButton = document.createElement("button");
      copyButton.textContent = "Copy to clipboard";
      copyButton.onclick = async () => {
        try {
          await navigator.clipboard.writeText(text);
          console.log("Text copied to clipboard");
        } catch (error) {
          console.error("Failed to copy text: ", error);
        }
      };
  
      // Add the button to the page
      document.body.appendChild(copyButton);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
