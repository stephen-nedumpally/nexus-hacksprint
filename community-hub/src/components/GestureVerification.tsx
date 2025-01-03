import { useEffect, useRef, useState } from 'react';

const gestures = [
  { name: 'peace', description: 'Show peace sign' },
  { name: 'thumbsUp', description: 'Show thumbs up' },
  { name: 'wave', description: 'Wave your hand' },
  { name: 'ok', description: 'Make an OK sign' },
  { name: 'fist', description: 'Make a fist' },
];

export function GestureVerification() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentGesture, setCurrentGesture] = useState(0);
  const [verified, setVerified] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!stream) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          setStream(mediaStream);
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleNextGesture = () => {
    if (currentGesture < gestures.length - 1) {
      setCurrentGesture((prev) => prev + 1);
    } else {
      setVerified(true);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  if (verified) {
    return (
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-green-600">Verification Complete!</h2>
        <p className="mt-2">You can now access all features of the Community Hub.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 right-4 bg-black/50 p-3 rounded">
          <p className="text-white text-center">
            {gestures[currentGesture].description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleNextGesture}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {currentGesture < gestures.length - 1 ? 'Next Gesture' : 'Complete Verification'}
        </button>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentGesture + 1) / gestures.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-center mt-2 text-sm text-gray-600">
          {currentGesture + 1} of {gestures.length} gestures completed
        </p>
      </div>
    </div>
  );
}
