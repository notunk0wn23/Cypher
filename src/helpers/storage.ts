// storage.ts
export interface ChatData {
    id: string;
    messages: {
      role: string;
      content: string;
      timestamp: number;
      id: string;
    }[];
  }
  
  const STORAGE_KEY = "chats";
  
  export function loadChats(): { [id: string]: ChatData } {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }
  
  export function saveChats(chats: { [id: string]: ChatData }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }
  
  export function loadChat(chatId: string): ChatData | null {
    const chats = loadChats();
    return chats[chatId] || null;
  }
  
  export function saveChat(chat: ChatData) {
    const chats = loadChats();
    chats[chat.id] = chat;
    saveChats(chats);
  }
  