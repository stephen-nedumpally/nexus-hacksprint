'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Webcam from 'react-webcam';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { drawHand } from '@/lib/handpose-utils';

const handSigns = [
  { emoji: '✌️', name: 'Victory', description: 'Show a peace sign' },
  { emoji: '👍', name: 'Thumbs Up', description: 'Show thumbs up' },
  { emoji: '👊', name: 'Fist', description: 'Make a fist' },
  { emoji: '🤘', name: 'Rock On', description: 'Show the rock on sign' },
  { emoji: '👋', name: 'Wave', description: 'Wave your hand' },
];

interface HandSignVerificationProps {
  onComplete: (data: { handSignVerified: boolean }) => void;
}

export function HandSignVerification({ onComplete }: HandSignVerificationProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [verifiedSigns, setVerifiedSigns] = useState<boolean[]>(
    new Array(handSigns.length).fill(false)
  );

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await handpose.load();
        setModel(loadedModel);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading handpose model:', error);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let countdownInterval: NodeJS.Timeout;

    const detect = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 &&
        model &&
        canvasRef.current
      ) {
        // Get video properties
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Set canvas dimensions
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // Make detection
        const hand = await model.estimateHands(video);

        // Draw hand landmarks
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          drawHand(hand, ctx);

          // Verify hand sign based on landmarks
          if (hand.length > 0) {
            const landmarks = hand[0].landmarks;
            const verified = verifyHandSign(landmarks, currentSignIndex);
            
            if (verified && !verifiedSigns[currentSignIndex]) {
              if (countdown === null) {
                setCountdown(3);
                countdownInterval = setInterval(() => {
                  setCountdown((prev) => {
                    if (prev === null || prev <= 1) {
                      clearInterval(countdownInterval);
                      const newVerifiedSigns = [...verifiedSigns];
                      newVerifiedSigns[currentSignIndex] = true;
                      setVerifiedSigns(newVerifiedSigns);
                      setCountdown(null);
                      return null;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }
            } else if (!verified && countdown !== null) {
              clearInterval(countdownInterval);
              setCountdown(null);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    };

    detect();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [model, currentSignIndex, verifiedSigns, countdown]);

  const verifyHandSign = (landmarks: number[][], signIndex: number) => {
    // Implement hand sign verification logic based on landmarks
    // This is a simplified example - you'll need to implement proper gesture recognition
    return true;
  };

  const handleNext = () => {
    if (currentSignIndex < handSigns.length - 1) {
      setCurrentSignIndex(prev => prev + 1);
    } else {
      onComplete({ handSignVerified: true });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400 mx-auto mb-4"></div>
        <p className="text-white">Loading hand detection model...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Show Hand Sign {currentSignIndex + 1} of {handSigns.length}
        </h2>
        <p className="text-gray-400 mb-4">
          Please show the following hand sign to verify your identity
        </p>
        <div className="text-6xl mb-4">{handSigns[currentSignIndex].emoji}</div>
        <p className="text-white">{handSigns[currentSignIndex].description}</p>
        {countdown !== null && (
          <p className="text-lime-400 text-xl mt-2">
            Hold for {countdown} seconds...
          </p>
        )}
      </div>

      <div className="relative mx-auto max-w-md">
        <Webcam
          ref={webcamRef}
          mirrored
          className="rounded-lg w-full"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {handSigns.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                verifiedSigns[index] ? 'bg-lime-400' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <Button
          onClick={handleNext}
          disabled={!verifiedSigns[currentSignIndex]}
          className="bg-lime-400 text-black hover:bg-lime-400/90"
        >
          {currentSignIndex === handSigns.length - 1 ? 'Complete' : 'Next Sign'}
        </Button>
      </div>
    </div>
  );
}
