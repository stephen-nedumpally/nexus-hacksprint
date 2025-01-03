'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { createStartup } from '@/lib/api/startups';
import { MultiSelect } from '@/components/ui/multi-select';

const startupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  logo: z.string().optional(),
  foundedYear: z.number().min(2000).max(new Date().getFullYear()),
  teamSize: z.number().min(1),
  domain: z.array(z.string()).min(1, 'Select at least one domain'),
  website: z.string().url().optional(),
  positions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    requirements: z.object({
      skills: z.array(z.string()),
      experience: z.number(),
      education: z.string().optional(),
    }),
  })).optional(),
});

type StartupFormValues = z.infer<typeof startupFormSchema>;

const domainOptions = [
  'AI/ML',
  'Web Development',
  'Mobile Development',
  'Cloud Computing',
  'Blockchain',
  'IoT',
  'Cybersecurity',
  'Data Science',
  'EdTech',
  'FinTech',
  'HealthTech',
  'Gaming',
];

export function CreateStartupForm() {
  const [positions, setPositions] = useState([]);
  const { toast } = useToast();
  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      foundedYear: new Date().getFullYear(),
      teamSize: 1,
      domain: [],
      website: '',
      positions: [],
    },
  });

  async function onSubmit(data: StartupFormValues) {
    try {
      await createStartup({ ...data, positions });
      toast({
        title: 'Success',
        description: 'Startup created successfully!',
      });
      form.reset();
      setPositions([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create startup. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Startup Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter startup name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your startup and its mission" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="foundedYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founded Year</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={2000}
                    max={new Date().getFullYear()}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={1}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domains</FormLabel>
              <FormControl>
                <MultiSelect
                  options={domainOptions.map(d => ({ label: d, value: d }))}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select domains"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Startup</Button>
      </form>
    </Form>
  );
}
