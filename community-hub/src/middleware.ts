import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Routes that require verification
const PROTECTED_ROUTES = [
  '/startups/create',
  '/startups/apply',
  '/my-startup',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check if user is authenticated
  if (!token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  // Check if the route requires verification
  if (PROTECTED_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
    // If user is not verified, redirect to verification page
    if (!token.verified) {
      const verifyUrl = new URL('/verify', request.url);
      verifyUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(verifyUrl);
    }
  }

  return NextResponse.next();
}
