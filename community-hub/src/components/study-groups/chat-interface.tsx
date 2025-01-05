'use client';

import { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile, PaperclipIcon, SendHorizontal, X } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';

interface Message {
  id: string;
  user: {
    name: string;
    role: 'Mentor' | 'Member';
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    avatar: string;
  };
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: {
        name: 'Arjun Mehta',
        role: 'Mentor',
        level: 'Advanced',
        avatar: 'AM'
      },
      content: 'Hey everyone! Welcome to our Full-Stack study group 👋',
      timestamp: '12:30 PM',
      isCurrentUser: false
    },
    {
      id: '2',
      user: {
        name: 'Priya Sharma',
        role: 'Member',
        level: 'Intermediate',
        avatar: 'PS'
      },
      content: "Thanks! I'm excited to learn React and Node.js",
      timestamp: '12:32 PM',
      isCurrentUser: false
    },
    {
      id: '3',
      user: {
        name: 'Vikram Singh',
        role: 'Mentor',
        level: 'Advanced',
        avatar: 'VS'
      },
      content: "We'll be covering advanced React patterns this week",
      timestamp: '12:35 PM',
      isCurrentUser: false
    },
    {
      id: '4',
      user: {
        name: 'Neha Patel',
        role: 'Member',
        level: 'Intermediate',
        avatar: 'NP'
      },
      content: 'Looking forward to the backend sessions!',
      timestamp: '12:36 PM',
      isCurrentUser: false
    },
    {
      id: '5',
      user: {
        name: 'Rahul Kumar',
        role: 'Member',
        level: 'Advanced',
        avatar: 'RK'
      },
      content: 'I can help with any MongoDB questions',
      timestamp: '12:37 PM',
      isCurrentUser: false
    },
    {
      id: '6',
      user: {
        name: 'Sneha Gupta',
        role: 'Member',
        level: 'Beginner',
        avatar: 'SG'
      },
      content: 'Has anyone started the portfolio project?',
      timestamp: '12:38 PM',
      isCurrentUser: false
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || selectedFile) {
      const message: Message = {
        id: messages.length + 1 + '',
        user: {
          name: 'You',
          role: 'Member',
          level: 'Beginner',
          avatar: 'YO'
        },
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
        ...(selectedFile && {
          attachment: {
            name: selectedFile.name,
            size: formatFileSize(selectedFile.size),
            type: selectedFile.type
          }
        })
      };
      setMessages([...messages, message]);
      setNewMessage("");
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleEmojiSelect = (emojiObject: any) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };

  return (
    <div className="flex flex-col h-[700px] bg-[#0F1218] rounded-lg">
      <div className="p-4 border-b border-[#1F2937]">
        <h2 className="text-lg font-semibold text-white">Group Chat</h2>
        <p className="text-sm text-gray-400">15 members</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${message.isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-start space-x-3`}>
                {!message.isCurrentUser && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#1F2937] flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-300">{message.user.avatar}</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-400">{message.user.name}</span>
                    {!message.isCurrentUser && (
                      <>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          message.user.role === 'Mentor' 
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {message.user.role}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          message.user.level === 'Advanced'
                            ? 'bg-green-500/20 text-green-400'
                            : message.user.level === 'Intermediate'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {message.user.level}
                        </span>
                      </>
                    )}
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.isCurrentUser
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#1F2937] text-gray-100'
                  }`}>
                    {message.content}
                    {message.attachment && (
                      <div className="mt-2 p-2 bg-black/20 rounded">
                        <div className="flex items-center">
                          <PaperclipIcon className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{message.attachment.name}</p>
                            <p className="text-xs opacity-70">{message.attachment.size}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#1F2937]">
        {selectedFile && (
          <div className="mb-2 p-2 bg-[#1F2937] rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <PaperclipIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-300">{selectedFile.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({formatFileSize(selectedFile.size)})
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-300"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-300"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-0 border-none" 
              side="top" 
              align="start"
            >
              <div className="p-0">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            </PopoverContent>
          </Popover>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#1F2937] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button 
            type="submit" 
            className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            disabled={!newMessage.trim() && !selectedFile}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
