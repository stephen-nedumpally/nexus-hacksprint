'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const availableSkills = [
  // Programming Languages
  { id: 'js', name: 'JavaScript', category: 'Programming' },
  { id: 'ts', name: 'TypeScript', category: 'Programming' },
  { id: 'python', name: 'Python', category: 'Programming' },
  { id: 'java', name: 'Java', category: 'Programming' },
  { id: 'cpp', name: 'C++', category: 'Programming' },
  { id: 'rust', name: 'Rust', category: 'Programming' },
  { id: 'go', name: 'Go', category: 'Programming' },

  // Web Development
  { id: 'react', name: 'React', category: 'Web Development' },
  { id: 'nextjs', name: 'Next.js', category: 'Web Development' },
  { id: 'vue', name: 'Vue.js', category: 'Web Development' },
  { id: 'angular', name: 'Angular', category: 'Web Development' },
  { id: 'node', name: 'Node.js', category: 'Web Development' },
  { id: 'express', name: 'Express.js', category: 'Web Development' },

  // Mobile Development
  { id: 'react-native', name: 'React Native', category: 'Mobile' },
  { id: 'flutter', name: 'Flutter', category: 'Mobile' },
  { id: 'swift', name: 'Swift', category: 'Mobile' },
  { id: 'kotlin', name: 'Kotlin', category: 'Mobile' },

  // Data Science & AI
  { id: 'ml', name: 'Machine Learning', category: 'AI/ML' },
  { id: 'dl', name: 'Deep Learning', category: 'AI/ML' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'AI/ML' },
  { id: 'pytorch', name: 'PyTorch', category: 'AI/ML' },
  { id: 'data-analysis', name: 'Data Analysis', category: 'AI/ML' },

  // Cloud & DevOps
  { id: 'aws', name: 'AWS', category: 'Cloud' },
  { id: 'azure', name: 'Azure', category: 'Cloud' },
  { id: 'gcp', name: 'Google Cloud', category: 'Cloud' },
  { id: 'docker', name: 'Docker', category: 'DevOps' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps' },
  { id: 'ci-cd', name: 'CI/CD', category: 'DevOps' },

  // Database
  { id: 'sql', name: 'SQL', category: 'Database' },
  { id: 'mongodb', name: 'MongoDB', category: 'Database' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database' },
].sort((a, b) => a.name.localeCompare(b.name));

const categories = Array.from(new Set(availableSkills.map(skill => skill.category)));

interface SkillsSelectionProps {
  onComplete: (data: { selectedSkills: string[] }) => void;
}

export function SkillsSelection({ onComplete }: SkillsSelectionProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skillId)) {
        return prev.filter(id => id !== skillId);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, skillId];
    });
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedSkills.length === 5) {
      onComplete({ selectedSkills });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Select Your Top Skills</h2>
        <p className="text-gray-400">
          Choose 5 skills that best represent your expertise. These will be used for your
          skills assessment.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {selectedSkills.map((skillId) => {
          const skill = availableSkills.find(s => s.id === skillId);
          return (
            <Badge
              key={skillId}
              variant="outline"
              className="bg-lime-400/10 text-lime-400 border-lime-400/50"
              onClick={() => toggleSkill(skillId)}
            >
              {skill?.name}
              <span className="ml-1 cursor-pointer">×</span>
            </Badge>
          );
        })}
        {Array(5 - selectedSkills.length).fill(0).map((_, i) => (
          <Badge
            key={i}
            variant="outline"
            className="bg-white/5 text-gray-400 border-white/10"
          >
            Select skill
          </Badge>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search skills..."
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[300px] rounded-md border border-white/10 p-4">
        <div className="space-y-6">
          {categories.map((category) => {
            const categorySkills = filteredSkills.filter(
              skill => skill.category === category
            );
            if (categorySkills.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categorySkills.map((skill) => (
                    <Button
                      key={skill.id}
                      variant="outline"
                      className={`justify-start ${
                        selectedSkills.includes(skill.id)
                          ? 'bg-lime-400/10 text-lime-400 border-lime-400/50'
                          : 'bg-white/5 text-white border-white/10'
                      }`}
                      onClick={() => toggleSkill(skill.id)}
                      disabled={
                        selectedSkills.length >= 5 &&
                        !selectedSkills.includes(skill.id)
                      }
                    >
                      {skill.name}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Button
        onClick={handleSubmit}
        disabled={selectedSkills.length !== 5}
        className="w-full bg-lime-400 text-black hover:bg-lime-400/90"
      >
        Continue to Assessment
      </Button>
    </div>
  );
}
