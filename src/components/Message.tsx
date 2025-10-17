import React from 'react';
import { Bot, User } from 'lucide-react';

interface MessageProps {
  sender: 'user' | 'bot';
  text: string;
}

const Message = ({ sender, text }: MessageProps) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      {/* Avatar */}
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white shadow-md ${isUser ? 'bg-purple-600' : 'bg-gray-700'}`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      
      {/* Bubble */}
      <div
        className={`max-w-md rounded-lg p-3 shadow-sm ${
          isUser
            ? 'rounded-br-none bg-purple-600 text-white'
            : 'rounded-bl-none bg-white border border-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

export default Message;
