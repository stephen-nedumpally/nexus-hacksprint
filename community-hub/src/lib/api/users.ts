import prisma from '@/lib/prisma';

export async function fetchUserProfile() {
  try {
    const response = await fetch('/api/users/profile');
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
