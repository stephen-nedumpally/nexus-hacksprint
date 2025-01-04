'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SearchModal } from '@/components/startups/search-modal';
import { domains } from '@/data/startup-data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Startup } from '@/types/startup';

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
  traction: z.string().optional().or(z.literal('')),
  funding: z.string().optional().or(z.literal('')),
});

type StartupFormValues = z.infer<typeof startupFormSchema>;

export default function EditStartupPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDomainModal, setOpenDomainModal] = useState(false);
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
    },
  });

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const res = await fetch(`/api/startups/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch startup');
        }
        const startup: Startup = await res.json();
        
        // Set form values
        form.reset({
          name: startup.name,
          description: startup.description,
          logo: startup.logo || '',
          foundedYear: startup.foundedYear,
          teamSize: startup.teamSize,
          domain: startup.domain,
          website: startup.website || '',
          problem: startup.problem,
          solution: startup.solution,
          market: startup.market,
          traction: startup.traction || '',
          funding: startup.funding || '',
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load startup details. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartup();
  }, [params.id, form, toast]);

  const onSubmit = async (values: StartupFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/startups/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update startup');
      }

      toast({
        title: "Success",
        description: "Startup updated successfully",
        duration: 5000,
      });

      router.push(`/startups/${params.id}`);
    } catch (error) {
      console.error('Error updating startup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update startup',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black py-24">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-white/5 rounded" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white/5 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Startup</h1>
          <p className="text-muted-foreground">
            Update your startup details
          </p>
        </div>

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

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
