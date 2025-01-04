export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: [
    '/startups/create',
    '/startups/apply/:path*',
    '/my-startup/:path*',
    '/verify/:path*',
  ],
};
