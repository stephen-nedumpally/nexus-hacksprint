'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Position } from '@/types/startup';

interface CreatePositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startupId: string;
  onPositionCreated: (position: Position) => void;
}

export function CreatePositionDialog({
  open,
  onOpenChange,
  startupId,
  onPositionCreated,
}: CreatePositionDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startupId,
          title,
          description,
          requirements: {
            experience: parseInt(experience),
            education,
            skills: skills.split(',').map((s) => s.trim()),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create position');
      }

      const position = await response.json();
      onPositionCreated(position);
      onOpenChange(false);
      
      // Reset form
      setTitle('');
      setDescription('');
      setExperience('');
      setEducation('');
      setSkills('');
    } catch (error) {
      console.error('Error creating position:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Position</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Position Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience (years)</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g., Bachelor's in Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Comma-separated list of skills"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-lime-400 text-black hover:bg-lime-400/90"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Position'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
