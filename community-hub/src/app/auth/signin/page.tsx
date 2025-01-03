'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  StatsFloatingCard,
  OpportunityFloatingCard,
  StudyGroupFloatingCard,
  StartupFloatingCard,
  StudentFloatingCard,
  AchievementFloatingCard,
  HackathonFloatingCard,
  InnovationFloatingCard,
} from '@/components/ui/floating-card';

export default function SignIn() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-black p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />

      {/* Floating cards - positioned radially */}
      <div className="absolute inset-0 max-w-4xl mx-auto">
        <StatsFloatingCard
          className="left-[10%] top-[35%] -rotate-12 transform"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <OpportunityFloatingCard
          className="right-[12%] top-[45%] rotate-6 transform"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        />
        <StudyGroupFloatingCard
          className="bottom-[30%] left-[30%] -rotate-6 transform"
          style={{ animation: 'float 7s ease-in-out infinite' }}
        />
        <StartupFloatingCard
          className="bottom-[30%] right-[30%] rotate-12 transform"
          style={{ animation: 'float 9s ease-in-out infinite' }}
        />
        <StudentFloatingCard
          className="left-[30%] top-[20%] rotate-3 transform"
          style={{ animation: 'float 10s ease-in-out infinite' }}
        />
        <AchievementFloatingCard
          className="right-[30%] top-[20%] -rotate-3 transform"
          style={{ animation: 'float 11s ease-in-out infinite' }}
        />
        <HackathonFloatingCard
          className="left-[20%] bottom-[20%] -rotate-12 transform"
          style={{ animation: 'float 9.5s ease-in-out infinite' }}
        />
        <InnovationFloatingCard
          className="right-[20%] bottom-[20%] rotate-6 transform"
          style={{ animation: 'float 7.5s ease-in-out infinite' }}
        />
      </div>

      {/* Main card */}
      <Card className="relative w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Welcome to Rise
            </h1>
            <p className="text-sm text-zinc-400">
              Join a community of ambitious students going the extra mile
            </p>
          </div>
          <div className="space-y-4">
            <Button
              className="w-full bg-lime-400 text-black hover:bg-lime-400/90"
              onClick={() => signIn('google', { callbackUrl: '/' })}
            >
              Sign in with Google
            </Button>
            <p className="px-6 text-center text-sm text-zinc-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </Card>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation, 0deg));
          }
        }
      `}</style>
    </div>
  );
}
