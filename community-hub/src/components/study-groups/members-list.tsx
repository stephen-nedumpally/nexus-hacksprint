'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Member {
  id: number;
  name: string;
  role: string;
  level: string;
  joinDate: string;
}

const members: Member[] = [
  { id: 1, name: "Arjun Mehta", role: "Mentor", level: "Advanced", joinDate: "Dec 2024" },
  { id: 2, name: "Priya Sharma", role: "Member", level: "Intermediate", joinDate: "Dec 2024" },
  { id: 3, name: "Rahul Kumar", role: "Member", level: "Beginner", joinDate: "Jan 2025" },
  { id: 4, name: "Neha Gupta", role: "Member", level: "Intermediate", joinDate: "Dec 2024" },
  { id: 5, name: "Vikram Singh", role: "Mentor", level: "Advanced", joinDate: "Dec 2024" },
  { id: 6, name: "Ananya Patel", role: "Member", level: "Beginner", joinDate: "Jan 2025" },
  { id: 7, name: "Karthik Iyer", role: "Member", level: "Intermediate", joinDate: "Dec 2024" },
  { id: 8, name: "Divya Reddy", role: "Member", level: "Beginner", joinDate: "Jan 2025" },
  { id: 9, name: "Aditya Shah", role: "Member", level: "Intermediate", joinDate: "Dec 2024" },
  { id: 10, name: "Meera Nair", role: "Member", level: "Beginner", joinDate: "Jan 2025" },
  { id: 11, name: "Rohan Verma", role: "Member", level: "Intermediate", joinDate: "Dec 2024" },
  { id: 12, name: "Sanya Malhotra", role: "Member", level: "Beginner", joinDate: "Jan 2025" },
  { id: 13, name: "Kabir Khanna", role: "Member", level: "Intermediate", joinDate: "Dec 2024" },
  { id: 14, name: "Zara Ahmed", role: "Member", level: "Beginner", joinDate: "Jan 2025" },
  { id: 15, name: "Ishaan Joshi", role: "Member", level: "Intermediate", joinDate: "Dec 2024" }
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500"
];

const getRandomColor = () => {
  return avatarColors[Math.floor(Math.random() * avatarColors.length)];
};

const levelColors = {
  Beginner: "bg-green-500",
  Intermediate: "bg-blue-500",
  Advanced: "bg-purple-500"
};

export default function MembersList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Avatar className={`${getRandomColor()} h-12 w-12`}>
            <AvatarFallback className="text-white text-lg">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">{member.name}</div>
                <div className="text-sm text-gray-400">Joined {member.joinDate}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-white border-gray-600">
                {member.role}
              </Badge>
              <Badge className={`${levelColors[member.level as keyof typeof levelColors]} text-white`}>
                {member.level}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
