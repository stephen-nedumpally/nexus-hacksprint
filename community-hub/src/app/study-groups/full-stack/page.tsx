'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Map, Bell, BookOpen } from "lucide-react";
import DetailedRoadmap from "@/components/study-groups/detailed-roadmap";
import ChatInterface from "@/components/study-groups/chat-interface";
import MembersList from "@/components/study-groups/members-list";
import { Updates, Resources } from "@/components/study-groups/updates-resources";

export default function FullStackGroup() {
  const [activeTab, setActiveTab] = useState("roadmap");

  const renderContent = () => {
    switch (activeTab) {
      case "roadmap":
        return <DetailedRoadmap />;
      case "chat":
        return <ChatInterface />;
      case "members":
        return <MembersList />;
      case "updates":
        return <Updates />;
      case "resources":
        return <Resources />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-40px)] bg-[#0A0C10] flex flex-col">
      {/* Header */}
      <div className="bg-[#0F1218] border-b border-[#1F2937]">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg overflow-hidden">
                <img 
                  src="/coding.jpg"
                  alt="Group" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Full-Stack Development</h1>
                <p className="text-sm text-gray-400">Web Dev Society • 15 members</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="bg-transparent border-[#1F2937] text-gray-300 hover:bg-[#1F2937] hover:text-white"
              >
                Share Group
              </Button>
              <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                Invite Members
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#0F1218] border-r border-[#1F2937]">
          <div className="py-4 px-2">
            {[
              { id: "roadmap", icon: <Map className="h-4 w-4" />, label: "Learning Roadmap" },
              { id: "chat", icon: <MessageSquare className="h-4 w-4" />, label: "Group Chat" },
              { id: "members", icon: <Users className="h-4 w-4" />, label: "Members" },
              { id: "updates", icon: <Bell className="h-4 w-4" />, label: "Updates" },
              { id: "resources", icon: <BookOpen className="h-4 w-4" />, label: "Resources" },
            ].map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start px-3 py-2 mb-1 ${
                  activeTab === item.id
                    ? "bg-[#1F2937] text-white"
                    : "text-gray-400 hover:bg-[#1F2937] hover:text-white"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden bg-[#0A0C10]">
          <div className="h-full max-w-screen-xl mx-auto p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
