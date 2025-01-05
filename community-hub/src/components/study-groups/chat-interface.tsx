'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smile, PaperclipIcon, Send } from "lucide-react";

interface Message {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  initials: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Arjun Mehta",
      content: "Hey everyone! Welcome to our Full-Stack study group 👋",
      timestamp: "12:30 PM",
      isCurrentUser: false,
      initials: "AM"
    },
    {
      id: 2,
      user: "Priya Sharma",
      content: "Thanks! I'm excited to learn React and Node.js",
      timestamp: "12:32 PM",
      isCurrentUser: false,
      initials: "PS"
    },
    {
      id: 3,
      user: "Vikram Singh",
      content: "We'll be covering advanced React patterns this week",
      timestamp: "12:35 PM",
      isCurrentUser: false,
      initials: "VS"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        user: "You",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
        initials: "YO"
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F1218] rounded-lg">
      <div className="p-4 border-b border-[#1F2937]">
        <h2 className="text-lg font-semibold text-white">Group Chat</h2>
        <p className="text-sm text-gray-400">15 members</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                } items-start space-x-3`}
              >
                {!message.isCurrentUser && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#1F2937] flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-300">{message.initials}</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-400">{message.user}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.isCurrentUser
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#1F2937] text-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#1F2937]">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-300"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-300"
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#1F2937] border-[#2D3748] text-white placeholder-gray-400"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-[#2563EB] hover:bg-[#1D4ED8]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
