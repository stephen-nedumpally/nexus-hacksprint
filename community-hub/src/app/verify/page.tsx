'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HandSignDetector } from '@/components/verify/hand-sign-detector';
import { VerificationFlow } from "@/components/verify/verification-flow";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyPage() {
  const [handSignsCompleted, setHandSignsCompleted] = useState(false);
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        {!handSignsCompleted ? (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-center">Step 1: Verify Your Identity</h1>
            <p className="text-gray-400 text-center">Complete the hand sign verification</p>
            <HandSignDetector onComplete={() => setHandSignsCompleted(true)} />
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-center">Step 2: Complete Your Profile</h1>
            <p className="text-gray-400 text-center">Tell us more about yourself</p>
            <VerificationFlow 
              onComplete={() => {
                router.push('/profile');
                router.refresh();
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
