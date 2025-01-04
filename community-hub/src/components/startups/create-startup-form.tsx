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
import { domains, skills } from '@/data/startup-data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, X } from 'lucide-react';

const positionSchema = z.object({
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

const startupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  logo: z.string().url().optional().or(z.literal('')),
  foundedYear: z.coerce.number().min(2000).max(new Date().getFullYear()),
  teamSize: z.coerce.number().min(1),
  domain: z.array(z.string()).min(1, 'At least one domain is required'),
  website: z.string().url().optional().or(z.literal('')),
  problem: z.string().min(20, 'Problem statement must be at least 20 characters'),
  solution: z.string().min(20, 'Solution must be at least 20 characters'),
  market: z.string().min(1, 'Market size is required'),
  traction: z.string().optional(),
  funding: z.string().optional(),
  positions: z.array(positionSchema),
});

type StartupFormValues = z.infer<typeof startupFormSchema>;

export default function CreateStartupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDomainModal, setOpenDomainModal] = useState(false);
  const [openSkillsModal, setOpenSkillsModal] = useState(false);
  const [currentPositionIndex, setCurrentPositionIndex] = useState<number | null>(null);
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
      problem: '',
      solution: '',
      market: '',
      traction: '',
      funding: '',
      positions: [],
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create startup');
      }

      toast({
        title: "Success",
        description: "Startup created successfully",
        duration: 5000,
      });

      router.push(`/startups/${data.id}`);
    } catch (error) {
      console.error('Error creating startup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create startup',
      });
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
        type: 'FULL_TIME',
        location: '',
        requirements: [],
        responsibilities: '',
        qualifications: '',
        equity: '',
        stipend: '',
      },
    ]);
  };

  const removePosition = (index: number) => {
    const positions = form.getValues('positions');
    positions.splice(index, 1);
    form.setValue('positions', positions);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      placeholder="Brief description of your startup"
                      {...field}
                    />
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
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
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
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Domains</FormLabel>
              <div className="flex flex-wrap gap-2">
                {form.watch('domain').map((domain, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-md bg-accent px-3 py-1"
                  >
                    <span>{domain}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newDomains = [...form.watch('domain')];
                        newDomains.splice(index, 1);
                        form.setValue('domain', newDomains);
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
                  onClick={() => setOpenDomainModal(true)}
                >
                  Add Domain
                </Button>
              </div>
              <FormMessage>{form.formState.errors.domain?.message}</FormMessage>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problem & Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="problem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Statement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What problem are you solving?"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="How are you solving this problem?"
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
            <CardTitle>Market & Traction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Size</FormLabel>
                  <FormControl>
                    <Input placeholder="Market size" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="traction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Traction</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your current traction"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="funding"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Status</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Current funding status"
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
            <div className="flex items-center justify-between">
              <CardTitle>Open Positions</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={addPosition}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Position
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {form.watch('positions').map((_, index) => (
              <Card key={index}>
                <CardHeader className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => removePosition(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardTitle>Position {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`positions.${index}.title`}
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
                    name={`positions.${index}.description`}
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
                      name={`positions.${index}.type`}
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
                      name={`positions.${index}.location`}
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
                      {form.watch(`positions.${index}.requirements`).map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="flex items-center gap-2 rounded-md bg-accent px-3 py-1"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newSkills = [...form.watch(`positions.${index}.requirements`)];
                              newSkills.splice(skillIndex, 1);
                              form.setValue(`positions.${index}.requirements`, newSkills);
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
                        onClick={() => {
                          setCurrentPositionIndex(index);
                          setOpenSkillsModal(true);
                        }}
                      >
                        Add Skill
                      </Button>
                    </div>
                    <FormMessage>{form.formState.errors.positions?.[index]?.requirements?.message}</FormMessage>
                  </div>

                  <FormField
                    control={form.control}
                    name={`positions.${index}.responsibilities`}
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
                    name={`positions.${index}.qualifications`}
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`positions.${index}.equity`}
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
                      name={`positions.${index}.stipend`}
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
            ))}
          </CardContent>
        </Card>

        <SearchModal
          open={openDomainModal}
          onOpenChange={setOpenDomainModal}
          title="Select Domain"
          items={domains}
          selectedItems={form.watch('domain')}
          onSelect={(domain) => {
            if (!form.watch('domain').includes(domain)) {
              form.setValue('domain', [...form.watch('domain'), domain]);
            }
          }}
        />

        <SearchModal
          open={openSkillsModal}
          onOpenChange={setOpenSkillsModal}
          title="Select Skills"
          items={skills}
          selectedItems={currentPositionIndex !== null ? form.watch(`positions.${currentPositionIndex}.requirements`) : []}
          onSelect={(skill) => {
            if (currentPositionIndex !== null) {
              const currentSkills = form.watch(`positions.${currentPositionIndex}.requirements`);
              if (!currentSkills.includes(skill)) {
                form.setValue(`positions.${currentPositionIndex}.requirements`, [...currentSkills, skill]);
              }
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
            {isSubmitting ? 'Creating...' : 'Create Startup'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
