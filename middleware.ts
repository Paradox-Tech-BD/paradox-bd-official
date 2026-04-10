import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/courses/instructor-panel(.*)',
  '/courses/dashboard(.*)',
  '/api/admin(.*)',
  '/admin(.*)',
]);

const isAdminOnlyRoute = createRouteMatcher([
  '/api/admin(.*)',
  '/admin(.*)',
]);

const isInstructorRoute = createRouteMatcher([
  '/courses/instructor-panel(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  if (isAdminOnlyRoute(req)) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
    if (role !== 'admin') {
      return new Response('Forbidden', { status: 403 });
    }
  }

  if (isInstructorRoute(req)) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'instructor') {
      return new Response('Forbidden', { status: 403 });
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
