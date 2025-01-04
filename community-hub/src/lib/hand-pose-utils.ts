import { AnnotatedPrediction } from '@tensorflow-models/handpose';

type Landmark = [number, number, number];
type HandGesture = {
  name: string;
  emoji: string;
  checkGesture: (landmarks: Landmark[]) => boolean;
};

// Check if a finger is extended by comparing its tip to base position
const isFingerExtended = (
  landmarks: Landmark[],
  tipIndex: number,
  baseIndex: number,
  threshold = 60  // Balanced threshold for accuracy
): boolean => {
  const tip = landmarks[tipIndex];
  const base = landmarks[baseIndex];
  
  // Calculate vertical distance (y-axis)
  const distance = base[1] - tip[1];
  
  // Moderate horizontal tolerance
  const horizontalOffset = Math.abs(tip[0] - base[0]);
  const isVertical = horizontalOffset < 70; // Balanced horizontal tolerance
  
  return distance > threshold && isVertical;
};

// Get the state of all fingers (extended or not)
const getFingerState = (landmarks: Landmark[]) => {
  return {
    thumb: isFingerExtended(landmarks, 4, 2, 40), // Adjusted threshold for thumb
    index: isFingerExtended(landmarks, 8, 5), // Index tip to index base
    middle: isFingerExtended(landmarks, 12, 9), // Middle tip to middle base
    ring: isFingerExtended(landmarks, 16, 13), // Ring tip to ring base
    pinky: isFingerExtended(landmarks, 20, 17), // Pinky tip to pinky base
  };
};

export const HAND_GESTURES: HandGesture[] = [
  {
    name: 'Peace Sign',
    emoji: '✌️',
    checkGesture: (landmarks: Landmark[]) => {
      const fingers = getFingerState(landmarks);
      // Accurate peace sign - index and middle must be clearly up
      return fingers.index && fingers.middle && 
             !fingers.ring && !fingers.pinky;
    },
  },
  {
    name: 'Thumbs Up',
    emoji: '👍',
    checkGesture: (landmarks: Landmark[]) => {
      const fingers = getFingerState(landmarks);
      // Clear thumbs up position
      return fingers.thumb && 
             !fingers.index && !fingers.middle && 
             !fingers.ring && !fingers.pinky;
    },
  },
  {
    name: 'Wave',
    emoji: '👋',
    checkGesture: (landmarks: Landmark[]) => {
      const fingers = getFingerState(landmarks);
      // All main fingers must be up for wave
      return fingers.index && fingers.middle && 
             fingers.ring && fingers.pinky;
    },
  },
  {
    name: 'OK Sign',
    emoji: '👌',
    checkGesture: (landmarks: Landmark[]) => {
      const fingers = getFingerState(landmarks);
      // Clear OK sign position
      return !fingers.index && fingers.middle && 
             fingers.ring && fingers.pinky;
    },
  },
  {
    name: 'Rock On',
    emoji: '🤘',
    checkGesture: (landmarks: Landmark[]) => {
      const fingers = getFingerState(landmarks);
      // Clear rock on position
      return fingers.index && !fingers.middle && 
             !fingers.ring && fingers.pinky;
    },
  },
];

// Keep track of recent detections for stability without long holds
let recentDetections: string[] = [];
const DETECTION_HISTORY = 3; // Very short history for quick response
const DETECTION_THRESHOLD = 0.65; // Balanced threshold for accuracy

export const detectHandGesture = (
  prediction: AnnotatedPrediction
): HandGesture | null => {
  const landmarks = prediction.landmarks;
  
  // Add debug information to see finger states
  const fingers = getFingerState(landmarks);
  console.log('Finger states:', fingers);
  
  // Check each gesture
  let detectedGesture: HandGesture | null = null;
  for (const gesture of HAND_GESTURES) {
    if (gesture.checkGesture(landmarks)) {
      detectedGesture = gesture;
      break;
    }
  }
  
  // Add to recent detections
  recentDetections.push(detectedGesture?.name || 'none');
  if (recentDetections.length > DETECTION_HISTORY) {
    recentDetections.shift();
  }
  
  // Quick stability check
  const mostCommon = recentDetections.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const [mostFrequent] = Object.entries(mostCommon).sort((a, b) => b[1] - a[1]);
  const [gestureName, count] = mostFrequent;
  
  if (count / DETECTION_HISTORY >= DETECTION_THRESHOLD && gestureName !== 'none') {
    return HAND_GESTURES.find(g => g.name === gestureName) || null;
  }
  
  return null;
};
