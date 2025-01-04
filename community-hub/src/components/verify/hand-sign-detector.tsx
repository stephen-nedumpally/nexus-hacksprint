'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Camera, RefreshCw } from 'lucide-react';
import { HAND_GESTURES, detectHandGesture } from '@/lib/hand-pose-utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface DetectionState {
  isCorrect: boolean;
  message: string;
}

interface HandLandmarks {
  landmarks: number[][];
  boundingBox: {
    topLeft: [number, number];
    bottomRight: [number, number];
  };
}

interface HandSignDetectorProps {
  onComplete?: () => void;
}

export function HandSignDetector({ onComplete }: HandSignDetectorProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processedVideoRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [detectionState, setDetectionState] = useState<DetectionState>({
    isCorrect: false,
    message: '',
  });
  const [handLandmarks, setHandLandmarks] = useState<HandLandmarks | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const correctGestureCount = useRef(0);
  const REQUIRED_CORRECT_FRAMES = 3; // Just need a few frames to confirm
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const drawHandLandmarks = (landmarks: number[][], canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    landmarks.forEach((point, index) => {
      const x = point[0];
      const y = point[1];

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#00ff00';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(index.toString(), x + 10, y + 10);
    });

    const fingerConnections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20],
      [0, 5], [5, 9], [9, 13], [13, 17]
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    fingerConnections.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[start][0], landmarks[start][1]);
      ctx.lineTo(landmarks[end][0], landmarks[end][1]);
      ctx.stroke();
    });
  };

  const processVideo = (inputCanvas: HTMLCanvasElement) => {
    const outputCanvas = processedVideoRef.current;
    if (!outputCanvas) return;

    const inputCtx = inputCanvas.getContext('2d');
    const outputCtx = outputCanvas.getContext('2d');
    if (!inputCtx || !outputCtx) return;

    // Get the image data
    const imageData = inputCtx.getImageData(0, 0, inputCanvas.width, inputCanvas.height);
    const data = imageData.data;

    // Apply filters
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const contrast = 1.5; // Contrast factor
      data[i] = Math.min(255, Math.max(0, (avg + (data[i] - avg) * contrast)));
      data[i + 1] = Math.min(255, Math.max(0, (avg + (data[i + 1] - avg) * contrast)));
      data[i + 2] = Math.min(255, Math.max(0, (avg + (data[i + 2] - avg) * contrast)));

      // Apply brightness
      const brightness = 5;
      data[i] = Math.min(255, data[i] + brightness);
      data[i + 1] = Math.min(255, data[i + 1] + brightness);
      data[i + 2] = Math.min(255, data[i + 2] + brightness);
    }

    // Put the processed image back
    outputCtx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        await tf.setBackend('webgl');
        const loadedModel = await handpose.load({
          maxContinuousChecks: 5,
          detectionConfidence: 0.8,
        });
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading hand detection model:', error);
        setDetectionState({
          isCorrect: false,
          message: 'Failed to load hand detection model. Please refresh the page.',
        });
      }
    };
    loadModel();

    return () => {
      tf.dispose();
    };
  }, []);

  useEffect(() => {
    let animationFrame: number;
    const detectHands = async () => {
      if (!model || !webcamRef.current?.video || !canvasRef.current || !processedVideoRef.current || !isDetecting || isVerified) return;

      try {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw video to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Process the video
        processVideo(canvas);

        // Stop detection if we've completed all gestures
        if (currentSignIndex >= HAND_GESTURES.length) {
          setIsDetecting(false);
          setIsVerified(true);
          setShowCompletionModal(true);
          // Call onComplete after verification
          if (onComplete) {
            setTimeout(() => {
              onComplete();
            }, 1500); // Give time for the completion animation
          }
          return;
        }

        // Use the processed video for detection
        const predictions = await model.estimateHands(processedVideoRef.current);
        
        if (predictions.length > 0) {
          const landmarks = predictions[0].landmarks;
          const boundingBox = {
            topLeft: [
              Math.min(...landmarks.map(l => l[0])),
              Math.min(...landmarks.map(l => l[1]))
            ],
            bottomRight: [
              Math.max(...landmarks.map(l => l[0])),
              Math.max(...landmarks.map(l => l[1]))
            ]
          };

          setHandLandmarks({ landmarks, boundingBox });
          drawHandLandmarks(landmarks, canvasRef.current);

          const gesture = detectHandGesture(predictions[0]);
          const expectedGesture = HAND_GESTURES[currentSignIndex];
          
          if (gesture?.name === expectedGesture.name) {
            correctGestureCount.current += 1;
            
            setDetectionState({
              isCorrect: true,
              message: 'Perfect! Moving to next sign...',
            });

            if (correctGestureCount.current >= REQUIRED_CORRECT_FRAMES) {
              // Move to next sign immediately
              const nextIndex = currentSignIndex + 1;
              const newProgress = ((nextIndex) / HAND_GESTURES.length) * 100;
              
              setProgress(newProgress);
              if (nextIndex >= HAND_GESTURES.length) {
                setIsDetecting(false);
                setIsVerified(true);
                setShowCompletionModal(true);
                // Call onComplete after verification
                if (onComplete) {
                  setTimeout(() => {
                    onComplete();
                  }, 1500); // Give time for the completion animation
                }
              } else {
                setCurrentSignIndex(nextIndex);
                correctGestureCount.current = 0;
                setDetectionState({ isCorrect: false, message: '' });
              }
            }
          } else {
            correctGestureCount.current = 0;
            setDetectionState({
              isCorrect: false,
              message: gesture 
                ? `Detected ${gesture.name}. Please show ${expectedGesture.name}`
                : `Please show ${expectedGesture.name}`,
            });
          }

          setDebugInfo(
            gesture 
              ? `Detected: ${gesture.name}`  
              : 'No gesture detected'
          );
        } else {
          correctGestureCount.current = 0;
          setHandLandmarks(null);
          setDebugInfo('No hands detected');
          setDetectionState({
            isCorrect: false,
            message: 'No hands detected. Please show your hand clearly.',
          });
          const ctx = canvasRef.current.getContext('2d');
          ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        animationFrame = requestAnimationFrame(detectHands);
      } catch (error) {
        console.error('Error in hand detection:', error);
      }
    };

    detectHands();
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [model, isDetecting, isVerified, currentSignIndex, onComplete]);

  const startDetection = () => {
    setIsDetecting(true);
    setProgress(0);
    setCurrentSignIndex(0);
    setIsVerified(false);
    correctGestureCount.current = 0;
    setDetectionState({ isCorrect: false, message: '' });
  };

  if (!model) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xl -z-10" />

      <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm">
        <Webcam
          ref={webcamRef}
          mirrored
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user",
            brightness: 110,
            contrast: 40,
          }}
        />
        
        {/* Hidden processed video canvas */}
        <canvas
          ref={processedVideoRef}
          className="hidden"
          width={1280}
          height={720}
        />

        {/* Visible canvas for landmarks */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          width={1280}
          height={720}
        />

        <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded">
          {debugInfo}
        </div>
        
        {isDetecting && currentSignIndex < HAND_GESTURES.length && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <div className="text-8xl animate-bounce">
              {HAND_GESTURES[currentSignIndex].emoji}
            </div>
          </motion.div>
        )}
      </div>

      {detectionState.message && (
        <Alert variant={detectionState.isCorrect ? "default" : "destructive"}>
          {detectionState.isCorrect ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {detectionState.isCorrect ? "Good!" : "Attention"}
          </AlertTitle>
          <AlertDescription>
            {detectionState.message}
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6 bg-black/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {isVerified 
                ? "✅ Verification Complete!" 
                : isDetecting 
                  ? `Show this hand sign: ${HAND_GESTURES[currentSignIndex].name}`
                  : "Ready to verify?"
              }
            </h3>
            {!isDetecting && !isVerified && (
              <Button onClick={startDetection}>
                Start Verification
              </Button>
            )}
          </div>

          {(isDetecting || isVerified) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {!isDetecting && !isVerified && (
            <div className="grid grid-cols-5 gap-4 mt-4">
              {HAND_GESTURES.map((gesture, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-black/50 backdrop-blur-sm"
                >
                  <div className="text-3xl">{gesture.emoji}</div>
                  <div className="text-xs text-center text-muted-foreground">
                    {gesture.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {showCompletionModal && (
          <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="flex items-center justify-center text-2xl"
                  >
                    🎉 Verification Complete! 🎉
                  </motion.div>
                </DialogTitle>
                <DialogDescription className="text-center pt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-lg mb-4">
                      You have successfully completed the hand sign verification!
                    </p>
                    <div className="flex justify-center space-x-2">
                      {HAND_GESTURES.map((gesture, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="text-2xl"
                        >
                          {gesture.emoji}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
