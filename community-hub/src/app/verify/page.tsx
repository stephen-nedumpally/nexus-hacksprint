'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HandSignVerification } from '@/components/verify/hand-sign-verification';
import { SurveyQuestions } from '@/components/verify/survey-questions';
import { SkillsSelection } from '@/components/verify/skills-selection';
import { SkillsAssessment } from '@/components/verify/skills-assessment';

const steps = [
  { id: 1, name: 'Identity Verification' },
  { id: 2, name: 'Survey' },
  { id: 3, name: 'Skills Selection' },
  { id: 4, name: 'Skills Assessment' },
];

export default function VerificationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    handSignVerified: false,
    survey: null,
    selectedSkills: [],
    assessmentResults: null,
  });
  const router = useRouter();

  const progress = (currentStep / steps.length) * 100;

  const handleStepComplete = (stepData: any) => {
    setVerificationData(prev => ({ ...prev, ...stepData }));
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit all verification data
      handleVerificationComplete();
    }
  };

  const handleVerificationComplete = async () => {
    try {
      const response = await fetch('/api/verify/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      if (response.ok) {
        // Redirect based on where they came from (creating startup or applying)
        router.push('/verification-success');
      }
    } catch (error) {
      console.error('Error completing verification:', error);
    }
  };

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Complete Your Verification
            </h1>
            <Progress value={progress} className="h-2 bg-white/10" />
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`text-sm ${
                    step.id === currentStep
                      ? 'text-lime-400'
                      : step.id < currentStep
                      ? 'text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              ))}
            </div>
          </div>

          <Card className="p-6 border border-white/10 bg-black/50 backdrop-blur-sm">
            {currentStep === 1 && (
              <HandSignVerification onComplete={handleStepComplete} />
            )}
            {currentStep === 2 && (
              <SurveyQuestions onComplete={handleStepComplete} />
            )}
            {currentStep === 3 && (
              <SkillsSelection onComplete={handleStepComplete} />
            )}
            {currentStep === 4 && (
              <SkillsAssessment 
                selectedSkills={verificationData.selectedSkills} 
                onComplete={handleStepComplete} 
              />
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
