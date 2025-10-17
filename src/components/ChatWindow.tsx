"use client";

import React from 'react'; // <--- FIXED THIS LINE
import { Send } from 'lucide-react';

// For this to work, create a Message.tsx component as well.
import Message from '@/components/Message';

export interface MessageType {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatWindow = () => {
  const [messages, setMessages] = React.useState<MessageType[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm ready to answer questions based on your analysis. What would you like to know?",
    },
  ]);
  const [input, setInput] = React.useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: MessageType = {
      id: Date.now(),
      sender: 'user',
      text: input,
    };

    const botResponse: MessageType = {
      id: Date.now() + 1,
      sender: 'bot',
      text: 'Based on the analysis, publications on Leukemia have seen a 15% year-over-year growth, significantly higher than Lung Cancer.',
    };

    setMessages([...messages, userMessage, botResponse]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-6 bg-gray-50">
        {messages.map((msg) => (
          <Message key={msg.id} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
        <div className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-gray-50 p-3 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about your analysis..."
            className="flex-grow bg-transparent text-gray-800 outline-none text-sm"
          />
          <button
            onClick={handleSend}
            className="rounded-md bg-purple-600 p-2 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={!input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
