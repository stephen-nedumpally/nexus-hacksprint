'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

// Mock questions - in production, these would come from an API
const mockQuestions = {
  'js': [
    {
      id: 'js1',
      question: 'What is the output of: console.log(typeof typeof 1)?',
      options: ['number', 'string', 'undefined', 'object'],
      correct: 1, // string
    },
    // Add more JavaScript questions
  ],
  'python': [
    {
      id: 'py1',
      question: 'What is the output of: list(map(int, "123"))?',
      options: ['[123]', '[1, 2, 3]', 'Error', '"123"'],
      correct: 1, // [1, 2, 3]
    },
    // Add more Python questions
  ],
  // Add questions for other skills
};

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

interface SkillsAssessmentProps {
  selectedSkills: string[];
  onComplete: (data: { assessmentResults: any }) => void;
}

export function SkillsAssessment({ selectedSkills, onComplete }: SkillsAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [results, setResults] = useState<Record<string, number>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize questions
  useEffect(() => {
    // In production, fetch questions from API based on selected skills
    const questionsList: Question[] = [];
    selectedSkills.forEach(skill => {
      if (mockQuestions[skill as keyof typeof mockQuestions]) {
        // Get 6 questions for each skill
        questionsList.push(...mockQuestions[skill as keyof typeof mockQuestions].slice(0, 6));
      }
    });
    setQuestions(questionsList);
    setLoading(false);
  }, [selectedSkills]);

  // Timer effect
  useEffect(() => {
    if (loading || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    // Update results
    const currentQuestion = questions[currentQuestionIndex];
    const skillId = currentQuestion.id.slice(0, 2); // Extract skill ID from question ID
    const isCorrect = answerIndex === currentQuestion.correct;
    
    setResults(prev => ({
      ...prev,
      [skillId]: (prev[skillId] || 0) + (isCorrect ? 1 : 0),
    }));

    // Wait briefly before moving to next question
    setTimeout(handleNextQuestion, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      // Calculate final scores
      const finalScores = Object.entries(results).map(([skill, correct]) => ({
        skill,
        score: (correct / 6) * 100, // 6 questions per skill
      }));

      onComplete({ assessmentResults: finalScores });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400 mx-auto mb-4"></div>
        <p className="text-white">Loading assessment...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Skills Assessment</h2>
          <p className="text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-lime-400">{timeLeft}s</div>
          <p className="text-sm text-gray-400">Time remaining</p>
        </div>
      </div>

      <Progress 
        value={(currentQuestionIndex / questions.length) * 100} 
        className="h-2 bg-white/10"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 bg-white/5 border-white/10">
            <p className="text-lg text-white mb-6">{currentQuestion.question}</p>
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`justify-start h-auto py-4 px-6 text-left ${
                    selectedAnswer === index
                      ? selectedAnswer === currentQuestion.correct
                        ? 'bg-green-400/20 text-green-400 border-green-400/50'
                        : 'bg-red-400/20 text-red-400 border-red-400/50'
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between text-sm text-gray-400">
        <span>Select an answer to continue</span>
        <span>Time per question: 30s</span>
      </div>
    </div>
  );
}
