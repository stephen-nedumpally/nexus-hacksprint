'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SearchModal } from '@/components/startups/search-modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { skills } from '@/data/startup-data';

const positionFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  requirements: z.array(z.string()).min(1, 'At least one skill is required'),
  responsibilities: z.string().min(10, 'Responsibilities must be at least 10 characters'),
  qualifications: z.string().min(10, 'Qualifications must be at least 10 characters'),
  equity: z.string().optional(),
  stipend: z.string().optional(),
});

type PositionFormValues = z.infer<typeof positionFormSchema>;

export default function NewPositionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSkillsModal, setOpenSkillsModal] = useState(false);
  const { toast } = useToast();

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'FULL_TIME',
      location: '',
      requirements: [],
      responsibilities: '',
      qualifications: '',
      equity: '',
      stipend: '',
    },
  });

  const onSubmit = async (values: PositionFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/startups/${params.id}/positions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create position');
      }

      toast({
        title: "Success",
        description: "Position created successfully",
        duration: 5000,
      });

      router.push(`/startups/${params.id}`);
    } catch (error) {
      console.error('Error creating position:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create position',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Position</h1>
          <p className="text-muted-foreground">
            Create a new position for your startup
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Position Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full Stack Developer" {...field} />
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
                          placeholder="Brief description of the position"
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="INTERNSHIP">Internship</option>
                            <option value="CONTRACT">Contract</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Remote, New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel>Required Skills</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {form.watch('requirements').map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-md bg-accent px-3 py-1"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = [...form.watch('requirements')];
                            newSkills.splice(index, 1);
                            form.setValue('requirements', newSkills);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenSkillsModal(true)}
                    >
                      Add Skill
                    </Button>
                  </div>
                  <FormMessage>{form.formState.errors.requirements?.message}</FormMessage>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements & Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What will the candidate be responsible for?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualifications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What qualifications are required?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 0.5% - 1%" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stipend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stipend/Salary</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., $60,000 - $80,000/year"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <SearchModal
              open={openSkillsModal}
              onOpenChange={setOpenSkillsModal}
              title="Select Skills"
              items={skills}
              selectedItems={form.watch('requirements')}
              onSelect={(skill) => {
                if (!form.watch('requirements').includes(skill)) {
                  form.setValue('requirements', [...form.watch('requirements'), skill]);
                }
              }}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Position'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
