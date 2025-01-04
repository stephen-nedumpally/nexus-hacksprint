'use client';

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
import { createPosition } from '@/lib/api/startups';
import { MultiSelect } from '@/components/ui/multi-select';

const positionFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.object({
    skills: z.array(z.string()).min(1, 'Select at least one skill'),
    experience: z.number().min(0, 'Experience cannot be negative'),
    education: z.string().optional(),
  }),
});

type PositionFormValues = z.infer<typeof positionFormSchema>;

interface CreatePositionFormProps {
  startupId: string;
}

const skillOptions = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'AWS',
  'Docker',
  'Kubernetes',
  'Machine Learning',
  'Data Science',
  'UI/UX Design',
  'Product Management',
  'DevOps',
];

export function CreatePositionForm({ startupId }: CreatePositionFormProps) {
  const { toast } = useToast();
  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: {
        skills: [],
        experience: 0,
        education: '',
      },
    },
  });

  async function onSubmit(data: PositionFormValues) {
    try {
      await createPosition(startupId, data);
      toast({
        title: 'Success',
        description: 'Position created successfully!',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create position. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Frontend Developer" {...field} />
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
                  placeholder="Describe the role and responsibilities" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements.skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Skills</FormLabel>
              <FormControl>
                <MultiSelect
                  options={skillOptions.map(s => ({ label: s, value: s }))}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select required skills"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements.experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Experience (in months)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min={0}
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
          name="requirements.education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Education (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Bachelor's in Computer Science"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Position</Button>
      </form>
    </Form>
  );
}
