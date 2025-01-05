'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Users, MessageSquare, Map, Bell, BookOpen, Copy, Mail } from "lucide-react";
import DetailedRoadmap from "@/components/study-groups/detailed-roadmap";
import ChatInterface from "@/components/study-groups/chat-interface";
import MembersList from "@/components/study-groups/members-list";
import { Updates, Resources } from "@/components/study-groups/updates-resources";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function FullStackGroup() {
  const [activeTab, setActiveTab] = useState("roadmap");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

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
    <div className="min-h-[calc(100vh-40px)] mt-12  bg-[#0A0C10] flex flex-col">
      {/* Header */}
      <div className="bg-[#0F1218] border-b border-[#1F2937]">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg overflow-hidden">
                <img 
                  src="https://img-c.udemycdn.com/course/480x270/1042110_ffc3_4.jpg"
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
                onClick={() => setShowShareModal(true)}
              >
                Share Group
              </Button>
              <Button 
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                onClick={() => setShowInviteModal(true)}
              >
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
          <div className=" mx-auto p-6">
            {renderContent()}
          </div>
        </div>
      </div>
      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="bg-[#0F1218] border border-[#1F2937] text-white">
          <DialogHeader>
            <DialogTitle>Share Group</DialogTitle>
            <DialogDescription className="text-gray-400">
              Copy the link to share this group with others
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 bg-[#1F2937] p-2 rounded">
            <Input 
              readOnly 
              value="https://rise.com/groups/full-stack-dev"
              className="bg-transparent border-none text-gray-300"
            />
            <Button 
              variant="ghost" 
              className="hover:bg-[#2D3748]"
              onClick={() => {
                navigator.clipboard.writeText("https://rise.com/groups/full-stack-dev");
                toast({
                  title: "Link copied!",
                  description: "Share link has been copied to clipboard",
                });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="bg-[#0F1218] border border-[#1F2937] text-white">
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share the group via your preferred platform
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border-[#1F2937] hover:bg-[#1F2937]"
              onClick={() => window.open("https://wa.me/?text=Join%20our%20Full-Stack%20study%20group!")}
            >
              <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
              <span>WhatsApp</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border-[#1F2937] hover:bg-[#1F2937]"
              onClick={() => window.open("https://www.facebook.com/sharer/sharer.php")}
            >
              <Image src="/facebook.svg" alt="Facebook" width={20} height={20} />
              <span>Facebook</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border-[#1F2937] hover:bg-[#1F2937]"
              onClick={() => window.open("https://twitter.com/intent/tweet")}
            >
              <Image src="/twitter.svg" alt="Twitter" width={20} height={20} />
              <span>Twitter</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border-[#1F2937] hover:bg-[#1F2937]"
              onClick={() => window.open("mailto:?subject=Join%20our%20study%20group")}
            >
              <Mail className="h-5 w-5" />
              <span>Email</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
