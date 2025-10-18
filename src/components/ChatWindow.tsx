"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import Message from "@/components/Message";

export interface MessageType {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: MessageType = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Call your Next.js API route
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      const botMessage: MessageType = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          data.summary ||
          "Sorry, I couldn’t find relevant information. Please try again.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: MessageType = {
        id: Date.now() + 2,
        sender: "bot",
        text: "An error occurred while fetching data. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
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
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
