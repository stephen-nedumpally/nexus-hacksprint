'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

const startupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  logo: z.string().url().optional(),
  foundedYear: z.number().min(2000).max(new Date().getFullYear()),
  teamSize: z.number().min(1),
  domain: z.array(z.string()).min(1, 'At least one domain is required'),
  website: z.string().url().optional(),
  problemStatement: z.string().min(20, 'Problem statement must be at least 20 characters'),
  solution: z.string().min(20, 'Solution must be at least 20 characters'),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  tam: z.number().min(0, 'TAM must be a positive number'),
  sam: z.number().min(0, 'SAM must be a positive number'),
  competitors: z.number().min(0, 'Number of competitors must be a positive number'),
  mrr: z.number().min(0, 'MRR must be a positive number').optional(),
  stage: z.string(),
  fundingRound: z.string().optional(),
  fundingRaised: z.number().min(0, 'Funding raised must be a positive number').optional(),
  traction: z.string().optional(),
  positions: z.array(z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    requirements: z.object({
      skills: z.array(z.string()).min(1, 'At least one skill is required'),
      experience: z.number().min(0, 'Experience must be a positive number'),
      education: z.string().optional(),
    }),
  })).min(1, 'At least one position is required'),
});

type StartupFormValues = z.infer<typeof startupFormSchema>;

export function CreateStartupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      positions: [
        {
          title: '',
          description: '',
          requirements: {
            skills: [],
            experience: 0,
            education: '',
          },
        },
      ],
      techStack: [],
      domain: [],
    },
  });

  const onSubmit = async (values: StartupFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/startups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create startup');
      }

      const data = await response.json();
      router.push(`/startups/${data.id}`);
    } catch (error) {
      console.error('Error creating startup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPosition = () => {
    const positions = form.getValues('positions');
    form.setValue('positions', [
      ...positions,
      {
        title: '',
        description: '',
        requirements: {
          skills: [],
          experience: 0,
          education: '',
        },
      },
    ]);
  };

  const removePosition = (index: number) => {
    const positions = form.getValues('positions');
    form.setValue('positions', positions.filter((_, i) => i !== index));
  };

  const addSkill = (positionIndex: number) => {
    const skill = window.prompt('Enter skill:');
    if (!skill) return;

    const positions = form.getValues('positions');
    positions[positionIndex].requirements.skills.push(skill);
    form.setValue('positions', positions);
  };

  const addTechStack = () => {
    const tech = window.prompt('Enter technology:');
    if (!tech) return;

    const techStack = form.getValues('techStack');
    form.setValue('techStack', [...techStack, tech]);
  };

  const addDomain = () => {
    const domain = window.prompt('Enter domain:');
    if (!domain) return;

    const domains = form.getValues('domain');
    form.setValue('domain', [...domains, domain]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
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
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Domains</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch('domain').map((domain, index) => (
                  <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                    {domain}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={addDomain}>
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Problem & Solution */}
        <Card>
          <CardHeader>
            <CardTitle>Problem & Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="problemStatement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Statement</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Tech Stack</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch('techStack').map((tech, index) => (
                  <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                    {tech}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={addTechStack}>
                <Plus className="h-4 w-4 mr-2" />
                Add Technology
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Market & Traction */}
        <Card>
          <CardHeader>
            <CardTitle>Market & Traction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TAM (in millions)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SAM (in millions)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="competitors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Competitors</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mrr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MRR (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="traction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Metrics & Traction (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Funding */}
        <Card>
          <CardHeader>
            <CardTitle>Funding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fundingRound"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Round (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fundingRaised"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Funding Raised in Millions (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.watch('positions').map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">Position {index + 1}</CardTitle>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePosition(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`positions.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`positions.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Required Skills</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.watch(`positions.${index}.requirements.skills`).map((skill, skillIndex) => (
                        <div key={skillIndex} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                          {skill}
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" onClick={() => addSkill(index)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`positions.${index}.requirements.experience`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience (Years)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`positions.${index}.requirements.education`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={addPosition}>
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Startup'}
        </Button>
      </form>
    </Form>
  );
}
