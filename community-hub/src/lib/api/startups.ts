import { prisma } from '@/lib/prisma';

export async function fetchStartups() {
  const response = await fetch('/api/startups');
  if (!response.ok) {
    throw new Error('Failed to fetch startups');
  }
  return response.json();
}

export async function createStartup(data: any) {
  const response = await fetch('/api/startups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create startup');
  }

  return response.json();
}

export async function applyToPosition(positionId: string) {
  const response = await fetch('/api/startups/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ positionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to apply to position');
  }

  return response.json();
}

export async function getApplicationStatus(positionId: string) {
  const response = await fetch(`/api/startups/applications?positionId=${positionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch application status');
  }

  const data = await response.json();
  return data.status;
}
