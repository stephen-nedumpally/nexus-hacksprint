'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StartupCard } from '@/components/startups/startup-card';
import { fetchMyApplications } from '@/lib/api/startups';

export default function MyApplicationsPage() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: fetchMyApplications,
  });

  const stats = applications?.reduce(
    (acc, app) => {
      acc.total++;
      acc[app.status.toLowerCase()]++;
      return acc;
    },
    { total: 0, pending: 0, accepted: 0, rejected: 0 }
  ) || { total: 0, pending: 0, accepted: 0, rejected: 0 };

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
        <p className="text-gray-400 mb-8">Track your startup applications</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border border-white/10 bg-white/5">
            <p className="text-sm text-gray-400">Total Applications</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </Card>
          <Card className="p-4 border border-white/10 bg-white/5">
            <p className="text-sm text-gray-400">Under Review</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </Card>
          <Card className="p-4 border border-white/10 bg-white/5">
            <p className="text-sm text-gray-400">Accepted</p>
            <p className="text-2xl font-bold text-green-400">{stats.accepted}</p>
          </Card>
          <Card className="p-4 border border-white/10 bg-white/5">
            <p className="text-sm text-gray-400">Rejected</p>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="h-64 animate-pulse bg-white/5 border-white/10"
              />
            ))}
          </div>
        ) : applications?.length === 0 ? (
          <Card className="p-8 text-center border border-white/10 bg-white/5">
            <p className="text-gray-400">
              You haven't applied to any startups yet.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications?.map((application) => (
              <Card
                key={application.id}
                className="relative overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm"
              >
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="outline"
                    className={
                      application.status === 'ACCEPTED'
                        ? 'border-green-400/50 text-green-400'
                        : application.status === 'REJECTED'
                        ? 'border-red-400/50 text-red-400'
                        : 'border-yellow-400/50 text-yellow-400'
                    }
                  >
                    {application.status}
                  </Badge>
                </div>
                <StartupCard
                  startup={application.position.startup}
                  requiresVerification={false}
                  onApply={() => {}}
                  hideApplyButton
                />
                <div className="px-6 pb-6">
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400">Applied Position</p>
                    <p className="text-white font-medium">
                      {application.position.title}
                    </p>
                    <p className="text-sm text-gray-400">Applied On</p>
                    <p className="text-white">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
