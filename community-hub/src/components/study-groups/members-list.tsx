'use client';

interface Member {
  id: string;
  name: string;
  role: 'Mentor' | 'Member';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  joinedDate: string;
  initials: string;
  color: string;
}

export default function MembersList() {
  const members: Member[] = [
    {
      id: '1',
      name: 'Arjun Mehta',
      role: 'Mentor',
      level: 'Advanced',
      joinedDate: '3 months ago',
      initials: 'AM',
      color: 'bg-gradient-to-br from-purple-500 to-blue-500'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'Member',
      level: 'Intermediate',
      joinedDate: '2 months ago',
      initials: 'PS',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      id: '3',
      name: 'Vikram Singh',
      role: 'Mentor',
      level: 'Advanced',
      joinedDate: '3 months ago',
      initials: 'VS',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      id: '4',
      name: 'Neha Patel',
      role: 'Member',
      level: 'Intermediate',
      joinedDate: '1 month ago',
      initials: 'NP',
      color: 'bg-gradient-to-br from-pink-500 to-rose-500'
    },
    {
      id: '5',
      name: 'Rahul Kumar',
      role: 'Member',
      level: 'Advanced',
      joinedDate: '2 months ago',
      initials: 'RK',
      color: 'bg-gradient-to-br from-orange-500 to-amber-500'
    },
    {
      id: '6',
      name: 'Sneha Gupta',
      role: 'Member',
      level: 'Beginner',
      joinedDate: '1 month ago',
      initials: 'SG',
      color: 'bg-gradient-to-br from-teal-500 to-emerald-500'
    },
    {
      id: '7',
      name: 'Karthik R',
      role: 'Member',
      level: 'Intermediate',
      joinedDate: '2 months ago',
      initials: 'KR',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-500'
    },
    {
      id: '8',
      name: 'Ananya Shah',
      role: 'Member',
      level: 'Beginner',
      joinedDate: '2 weeks ago',
      initials: 'AS',
      color: 'bg-gradient-to-br from-red-500 to-pink-500'
    },
    {
      id: '9',
      name: 'Dev Patel',
      role: 'Member',
      level: 'Intermediate',
      joinedDate: '1 month ago',
      initials: 'DP',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-500'
    },
    {
      id: '10',
      name: 'Meera Reddy',
      role: 'Member',
      level: 'Beginner',
      joinedDate: '3 weeks ago',
      initials: 'MR',
      color: 'bg-gradient-to-br from-violet-500 to-purple-500'
    },
    {
      id: '11',
      name: 'Arun Verma',
      role: 'Member',
      level: 'Advanced',
      joinedDate: '2 months ago',
      initials: 'AV',
      color: 'bg-gradient-to-br from-emerald-500 to-green-500'
    },
    {
      id: '12',
      name: 'Zara Khan',
      role: 'Member',
      level: 'Intermediate',
      joinedDate: '1 month ago',
      initials: 'ZK',
      color: 'bg-gradient-to-br from-amber-500 to-orange-500'
    },
    {
      id: '13',
      name: 'Rohan Joshi',
      role: 'Member',
      level: 'Beginner',
      joinedDate: '2 weeks ago',
      initials: 'RJ',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-500'
    },
    {
      id: '14',
      name: 'Tanya Mishra',
      role: 'Member',
      level: 'Intermediate',
      joinedDate: '3 weeks ago',
      initials: 'TM',
      color: 'bg-gradient-to-br from-rose-500 to-pink-500'
    },
    {
      id: '15',
      name: 'Kabir Singh',
      role: 'Member',
      level: 'Beginner',
      joinedDate: '1 week ago',
      initials: 'KS',
      color: 'bg-gradient-to-br from-purple-500 to-violet-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="bg-[#0F1218] rounded-lg border border-[#1F2937] p-4"
        >
          <div className="flex items-center space-x-4">
            <div className={`relative w-12 h-12`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-lg transform rotate-6 opacity-50`} />
              <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-lg transform -rotate-6 opacity-50`} />
              <div className="absolute inset-0 bg-[#0F1218] rounded-lg flex items-center justify-center">
                <span className="text-lg font-semibold text-white">
                  {member.initials}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium">{member.name}</h3>
              <p className="text-sm text-gray-400">Joined {member.joinedDate}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  member.role === 'Mentor'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {member.role}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  member.level === 'Advanced'
                    ? 'bg-blue-500/20 text-blue-400'
                    : member.level === 'Intermediate'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {member.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
