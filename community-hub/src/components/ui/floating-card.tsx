import { cn } from "@/lib/utils";
import { TrendingUp, Users, Briefcase, GraduationCap, Target, Star, Code, Trophy, Rocket } from "lucide-react";

interface FloatingCardProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function FloatingCard({ className, style, children }: FloatingCardProps) {
  return (
    <div
      className={cn(
        "absolute rounded-2xl bg-gradient-to-br p-6 shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:-translate-y-1",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function StatsFloatingCard({ className, ...props }: FloatingCardProps) {
  return (
    <FloatingCard
      className={cn(
        "from-purple-400/20 to-purple-600/20 text-white",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-purple-200" />
          <div className="text-sm font-medium text-purple-200">Active Projects</div>
        </div>
        <div className="text-2xl font-bold">2,451</div>
        <div className="h-[60px] w-[120px]">
          <div className="flex h-full items-end justify-between gap-1">
            {[40, 70, 45, 30, 65, 85, 30].map((height, i) => (
              <div
                key={i}
                className="w-3 rounded-t-sm bg-gradient-to-t from-purple-400 to-purple-200"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </FloatingCard>
  );
}

export function OpportunityFloatingCard({ className, ...props }: FloatingCardProps) {
  return (
    <FloatingCard
      className={cn(
        "from-lime-400/20 to-lime-600/20 text-white",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-lime-200" />
          <div>
            <div className="text-sm font-medium">Open Positions</div>
            <div className="text-xs text-lime-200">145 New Today</div>
          </div>
        </div>
        <div className="h-1 w-full rounded-full bg-black/20">
          <div className="h-full w-3/4 rounded-full bg-lime-400" />
        </div>
      </div>
    </FloatingCard>
  );
}

export function StudyGroupFloatingCard({ className, ...props }: FloatingCardProps) {
  return (
    <FloatingCard
      className={cn(
        "from-blue-400/20 to-blue-600/20 text-white",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-200" />
          <div>
            <div className="text-sm font-medium">Active Study Groups</div>
            <div className="text-xs text-blue-200">892 Members Online</div>
          </div>
        </div>
        <div className="flex -space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded-full border-2 border-black/20 bg-blue-300"
            />
          ))}
        </div>
      </div>
    </FloatingCard>
  );
}

export function StartupFloatingCard({ className, ...props }: FloatingCardProps) {
  return (
    <FloatingCard
      className={cn(
        "from-orange-400/20 to-orange-600/20 text-white",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-200" />
          <div>
            <div className="text-sm font-medium">Registered Startups</div>
            <div className="text-xs text-orange-200">385 Active Projects</div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-orange-400/30"
            />
          ))}
        </div>
      </div>
    </FloatingCard>
  );
}

export function StudentFloatingCard({ className, ...props }: FloatingCardProps) {
  return (
    <FloatingCard
      className={cn(
        "from-pink-400/20 to-pink-600/20 text-white",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-pink-200" />
          <div>
            <div className="text-sm font-medium">Students Enrolled</div>
            <div className="text-xs text-pink-200">12.5k Active Members</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-black/20">
            <div className="h-full w-[85%] rounded-full bg-pink-400" />
          </div>
          <span className="text-xs text-pink-200">85%</span>
        </div>
      </div>
    </FloatingCard>
  );
}

export function AchievementFloatingCard({ className, ...props }: FloatingCardProps) {
  return (
    <FloatingCard
      className={cn(
        "from-yellow-400/20 to-yellow-600/20 text-white",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-200" />
          <div>
            <div className="text-sm font-medium">Achievements Unlocked</div>
            <div className="text-xs text-yellow-200">256 This Week</div>
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 text-yellow-400"
              fill={i < 4 ? "currentColor" : "none"}
            />
          ))}
        </div>
      </div>
    </FloatingCard>
  );
}

export function HackathonFloatingCard({ className, ...props }: FloatingCardProps) {
  return (
    <FloatingCard
      className={cn(
        "from-cyan-400/20 to-cyan-600/20 text-white",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-cyan-200" />
          <div>
            <div className="text-sm font-medium">Active Hackathons</div>
            <div className="text-xs text-cyan-200">8 Projects Live</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full bg-cyan-400/50"
            />
          ))}
        </div>
      </div>
    </FloatingCard>
  );
}

export function InnovationFloatingCard({ className, ...props }: FloatingCardProps) {
  return (
    <FloatingCard
      className={cn(
        "from-indigo-400/20 to-indigo-600/20 text-white",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-indigo-200" />
          <div>
            <div className="text-sm font-medium">Innovation Labs</div>
            <div className="text-xs text-indigo-200">15 Active Projects</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-indigo-400/30 ring-2 ring-indigo-400/50"
            />
          ))}
        </div>
      </div>
    </FloatingCard>
  );
}
