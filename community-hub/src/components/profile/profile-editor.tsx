import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Plus, X, Pencil, Check } from "lucide-react";
import { validateUrl } from "@/lib/validations";
import { SkillSelector } from "./skill-selector";

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

interface ProfileEditorProps {
  profile: any;
  onUpdate: () => void;
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    source: profile?.source || "",
    education: profile?.education || "",
    status: profile?.status || "",
    advancedSkills: profile?.advancedSkills || [],
    intermediateSkills: profile?.intermediateSkills || [],
    beginnerSkills: profile?.beginnerSkills || [],
    linkedinUrl: profile?.linkedinUrl || "",
    githubUrl: profile?.githubUrl || "",
    portfolioUrl: profile?.portfolioUrl || "",
    projects: profile?.projects || [],
  });

  const [projectInput, setProjectInput] = useState({ name: "", url: "" });

  const handleUrlChange = (
    value: string,
    field: 'linkedinUrl' | 'githubUrl' | 'portfolioUrl'
  ) => {
    const validation = validateUrl(value, field);
    if (!validation.isValid) {
      toast({
        title: "Invalid URL",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }
    setFormData({ ...formData, [field]: value });
  };

  const handleProjectAdd = () => {
    if (!projectInput.name || !projectInput.url) {
      toast({
        title: "Missing Information",
        description: "Please provide both project name and URL",
        variant: "destructive",
      });
      return;
    }

    const validation = validateUrl(projectInput.url, 'project');
    if (!validation.isValid) {
      toast({
        title: "Invalid Project URL",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    setFormData({
      ...formData,
      projects: [...formData.projects, projectInput],
    });
    setProjectInput({ name: "", url: "" });
  };

  const handleProjectRemove = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_: any, i: number) => i !== index),
    });
  };

  const handleSubmit = async () => {
    // Validate LinkedIn URL (required)
    if (!formData.linkedinUrl) {
      toast({
        title: "LinkedIn Required",
        description: "Please provide your LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Clean up project data before sending
      const cleanProjects = formData.projects.map(project => ({
        name: project.name,
        url: project.url
      }));

      const dataToSend = {
        ...formData,
        projects: cleanProjects
      };

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Your professional information and skills</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (isEditing) {
              handleSubmit();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⌛</span>
              Saving...
            </span>
          ) : isEditing ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>How did you find us?</Label>
            {isEditing ? (
              <Select
                value={formData.source}
                onValueChange={(value) =>
                  setFormData({ ...formData, source: value })
                }
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
            ) : (
              <p className="text-sm text-gray-400">{formData.source}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Education Level</Label>
            {isEditing ? (
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
            ) : (
              <p className="text-sm text-gray-400">{formData.education}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Current Status</Label>
            {isEditing ? (
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
            ) : (
              <p className="text-sm text-gray-400">{formData.status}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Advanced Skills</Label>
            {isEditing ? (
              <SkillSelector
                level="advanced"
                selectedSkills={formData.advancedSkills}
                onSkillsChange={(skills) =>
                  setFormData({ ...formData, advancedSkills: skills })
                }
                advancedSkills={formData.advancedSkills}
                intermediateSkills={formData.intermediateSkills}
                beginnerSkills={formData.beginnerSkills}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.advancedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Intermediate Skills</Label>
            {isEditing ? (
              <SkillSelector
                level="intermediate"
                selectedSkills={formData.intermediateSkills}
                onSkillsChange={(skills) =>
                  setFormData({ ...formData, intermediateSkills: skills })
                }
                advancedSkills={formData.advancedSkills}
                intermediateSkills={formData.intermediateSkills}
                beginnerSkills={formData.beginnerSkills}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.intermediateSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Beginner Skills</Label>
            {isEditing ? (
              <SkillSelector
                level="beginner"
                selectedSkills={formData.beginnerSkills}
                onSkillsChange={(skills) =>
                  setFormData({ ...formData, beginnerSkills: skills })
                }
                advancedSkills={formData.advancedSkills}
                intermediateSkills={formData.intermediateSkills}
                beginnerSkills={formData.beginnerSkills}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.beginnerSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Professional Links</Label>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">LinkedIn (Required)</Label>
                {isEditing ? (
                  <Input
                    value={formData.linkedinUrl}
                    onChange={(e) => handleUrlChange(e.target.value, 'linkedinUrl')}
                    placeholder="https://linkedin.com/in/..."
                  />
                ) : (
                  <a
                    href={formData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {formData.linkedinUrl}
                  </a>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">GitHub</Label>
                {isEditing ? (
                  <Input
                    value={formData.githubUrl}
                    onChange={(e) => handleUrlChange(e.target.value, 'githubUrl')}
                    placeholder="https://github.com/..."
                  />
                ) : (
                  <a
                    href={formData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {formData.githubUrl}
                  </a>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Portfolio</Label>
                {isEditing ? (
                  <Input
                    value={formData.portfolioUrl}
                    onChange={(e) => handleUrlChange(e.target.value, 'portfolioUrl')}
                    placeholder="https://..."
                  />
                ) : formData.portfolioUrl && (
                  <a
                    href={formData.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {formData.portfolioUrl}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Projects</Label>
            {isEditing ? (
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
            ) : null}
            <div className="space-y-2">
              {formData.projects.map((project: any, index: number) => (
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
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleProjectRemove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
