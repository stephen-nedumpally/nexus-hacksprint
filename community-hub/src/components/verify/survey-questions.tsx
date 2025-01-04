'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const surveySchema = z.object({
  discovery: z.string({
    required_error: 'Please tell us how you discovered our platform',
  }),
  intention: z.string({
    required_error: 'Please tell us what you intend to do on our platform',
  }),
  status: z.string({
    required_error: 'Please select your current status',
  }),
  experience: z.string({
    required_error: 'Please tell us about your experience',
  }),
});

const discoveryOptions = [
  'Social Media',
  'Search Engine',
  'Friend/Colleague',
  'Professional Network',
  'Educational Institution',
  'Tech Event/Conference',
  'Other',
];

const statusOptions = [
  'Student',
  'Recent Graduate',
  'Professional Developer',
  'Freelancer',
  'Entrepreneur',
  'Tech Lead',
  'Other',
];

interface SurveyQuestionsProps {
  onComplete: (data: { survey: any }) => void;
}

export function SurveyQuestions({ onComplete }: SurveyQuestionsProps) {
  const form = useForm<z.infer<typeof surveySchema>>({
    resolver: zodResolver(surveySchema),
  });

  const onSubmit = (data: z.infer<typeof surveySchema>) => {
    onComplete({ survey: data });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Quick Survey</h2>
        <p className="text-gray-400">
          Help us understand you better to provide a more personalized experience
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="discovery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you discover our platform?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select how you found us" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {discoveryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intention"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you intend to do on our platform?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your goals and what you hope to achieve..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your current status?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tell us about your experience</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your professional background, projects, or any relevant experience..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-lime-400 text-black hover:bg-lime-400/90"
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}
