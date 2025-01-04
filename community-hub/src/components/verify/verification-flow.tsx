import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationFlowProps {
  onComplete: () => void;
  className?: string;
}

type Step = {
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    title: "How did you find us?",
    description: "We'd love to know how you discovered our platform",
  },
  {
    title: "Education & Status",
    description: "Tell us about your background",
  },
  {
    title: "Advanced Skills",
    description: "Select up to 5 skills you're most proficient in",
  },
  {
    title: "Intermediate Skills",
    description: "Select up to 5 skills you're comfortable with",
  },
  {
    title: "Beginner Skills",
    description: "Select up to 5 skills you're learning",
  },
  {
    title: "Professional Links",
    description: "Connect your professional profiles",
  },
  {
    title: "Projects",
    description: "Share your work (optional)",
  },
];

const SOURCE_OPTIONS = [
  "Search Engine",
  "Social Media",
  "Friend/Colleague",
  "University/College",
  "Professional Network",
  "Other",
];

const EDUCATION_OPTIONS = [
  "High School",
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D.",
  "Self-Taught",
  "Other",
];

const STATUS_OPTIONS = [
  "Student",
  "Employed",
  "Freelancer",
  "Startup Founder",
  "Looking for Opportunities",
  "Other",
];

const PROGRESS_MESSAGES = [
  "Great start! Let's get to know you better...",
  "You're doing great! Tell us about your background...",
  "Awesome! Now, what are you best at?",
  "You're making progress! What else are you good at?",
  "Almost there! What are you learning?",
  "Looking good! Let's connect your profiles...",
  "Final step! Share your amazing work...",
];

export function VerificationFlow({ onComplete, className }: VerificationFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    source: "",
    education: "",
    status: "",
    advancedSkills: [] as string[],
    intermediateSkills: [] as string[],
    beginnerSkills: [] as string[],
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    projects: [] as { name: string; url: string }[],
  });

  const [skillInput, setSkillInput] = useState("");
  const [projectInput, setProjectInput] = useState({ name: "", url: "" });

  const progress = isCompleted ? 100 : ((currentStep + 1) / STEPS.length) * 100;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/profile/complete-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to complete verification");

      setIsCompleted(true);
      toast({
        title: "Verification Completed!",
        description: "Your profile has been verified.",
      });
      
      // Delay the redirect slightly to show completion state
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 0 && !formData.source) {
      toast({ title: "Please select how you found us", variant: "destructive" });
      return;
    }
    if (currentStep === 1 && (!formData.education || !formData.status)) {
      toast({ title: "Please complete all fields", variant: "destructive" });
      return;
    }
    if (currentStep === 5 && !formData.linkedinUrl) {
      toast({ title: "LinkedIn profile is required", variant: "destructive" });
      return;
    }

    if (currentStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkillAdd = (level: "advanced" | "intermediate" | "beginner") => {
    if (!skillInput.trim()) return;

    const skillsKey = `${level}Skills` as keyof typeof formData;
    const currentSkills = formData[skillsKey] as string[];

    if (currentSkills.includes(skillInput)) {
      toast({ title: "Skill already added", variant: "destructive" });
      return;
    }

    if (currentSkills.length >= 5) {
      toast({ title: "Maximum 5 skills allowed", variant: "destructive" });
      return;
    }

    setFormData({
      ...formData,
      [skillsKey]: [...currentSkills, skillInput],
    });
    setSkillInput("");
  };

  const handleSkillRemove = (
    skill: string,
    level: "advanced" | "intermediate" | "beginner"
  ) => {
    const skillsKey = `${level}Skills` as keyof typeof formData;
    const currentSkills = formData[skillsKey] as string[];
    setFormData({
      ...formData,
      [skillsKey]: currentSkills.filter((s) => s !== skill),
    });
  };

  const handleProjectAdd = () => {
    if (!projectInput.name || !projectInput.url) return;

    setFormData({
      ...formData,
      projects: [...formData.projects, projectInput],
    });
    setProjectInput({ name: "", url: "" });
  };

  const handleProjectRemove = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Select
            value={formData.source}
            onValueChange={(value) => setFormData({ ...formData, source: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {SOURCE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select
                value={formData.education}
                onValueChange={(value) =>
                  setFormData({ ...formData, education: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select current status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
      case 3:
      case 4:
        const level =
          currentStep === 2
            ? "advanced"
            : currentStep === 3
            ? "intermediate"
            : "beginner";
        const skillsKey = `${level}Skills` as keyof typeof formData;
        const skills = formData[skillsKey] as string[];

        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Enter a skill"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSkillAdd(level);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSkillAdd(level)}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 space-x-2"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleSkillRemove(skill, level)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>LinkedIn Profile</Label>
              <Input
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label>GitHub Profile</Label>
              <Input
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Portfolio Website (Optional)</Label>
              <Input
                value={formData.portfolioUrl}
                onChange={(e) =>
                  setFormData({ ...formData, portfolioUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={projectInput.name}
                  onChange={(e) =>
                    setProjectInput({ ...projectInput, name: e.target.value })
                  }
                  placeholder="Project name"
                />
                <Input
                  value={projectInput.url}
                  onChange={(e) =>
                    setProjectInput({ ...projectInput, url: e.target.value })
                  }
                  placeholder="Project URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleProjectAdd}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {formData.projects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {project.url}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProjectRemove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-medium">100%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div className="h-full bg-lime-400 rounded-full transition-all duration-300 w-full" />
          </div>
        </div>

        <Card className="text-center py-8">
          <CardContent className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime-400 mb-4">
              <Check className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold">✅ Verification Complete!</h2>
            <p className="text-gray-400">
              Thank you for completing your profile. You're all set!
            </p>
            <p className="text-sm text-gray-400">
              Redirecting you to your profile...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-full bg-lime-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 text-center">
          {PROGRESS_MESSAGES[currentStep]}
        </p>
      </div>

      {/* Main Content */}
      <Card className={cn("w-full max-w-2xl mx-auto", className)}>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>{STEPS[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⌛</span>
                Submitting...
              </span>
            ) : currentStep === STEPS.length - 1 ? (
              "Complete"
            ) : (
              "Next"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
