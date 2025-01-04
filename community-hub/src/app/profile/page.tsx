'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { fetchUserProfile } from '@/lib/api/users';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
    enabled: !!session,
  });

  const canRetakeTest = profile?.skillTests?.[0]?.nextTestAt
    ? new Date(profile.skillTests[0].nextTestAt) <= new Date()
    : true;

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-lime-400/50">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ''}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-lime-400/20 flex items-center justify-center text-lime-400 text-3xl font-bold">
                  {session?.user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Hey there, {session?.user?.name}! 👋
              </h1>
              <p className="text-gray-400">{session?.user?.email}</p>
            </div>
          </div>

          {/* Survey Results */}
          <Card className="mb-8 p-6 border border-white/10 bg-black/50">
            <h2 className="text-xl font-semibold text-white mb-4">About You</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">How you found us</p>
                <p className="text-white">{profile?.survey?.discovery}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Status</p>
                <p className="text-white">{profile?.survey?.status}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-400 mb-1">Your Goals</p>
                <p className="text-white">{profile?.survey?.intention}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-400 mb-1">Experience</p>
                <p className="text-white">{profile?.survey?.experience}</p>
              </div>
            </div>
          </Card>

          {/* Skills Assessment */}
          <Card className="p-6 border border-white/10 bg-black/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Skills Assessment</h2>
              {canRetakeTest && (
                <Button
                  onClick={() => router.push('/verify')}
                  className="bg-lime-400 text-black hover:bg-lime-400/90"
                >
                  Retake Assessment
                </Button>
              )}
            </div>

            {profile?.skillTests?.[0] ? (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {profile.skillTests[0].skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-lime-400/10 text-lime-400 border-lime-400/50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-4">
                  {Object.entries(profile.skillTests[0].scores).map(([skill, score]) => (
                    <div key={skill}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">{skill}</span>
                        <span className="text-lime-400">{score}%</span>
                      </div>
                      <Progress value={score} className="h-2 bg-white/10" />
                    </div>
                  ))}
                </div>

                {!canRetakeTest && (
                  <p className="text-sm text-gray-400 mt-4">
                    You can retake the assessment after{' '}
                    {new Date(profile.skillTests[0].nextTestAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  You haven't taken the skills assessment yet.
                </p>
                <Button
                  onClick={() => router.push('/verify')}
                  className="bg-lime-400 text-black hover:bg-lime-400/90"
                >
                  Take Assessment
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
