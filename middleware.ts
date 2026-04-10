import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/courses/instructor-panel(.*)',
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

async function getUserRole(userId: string): Promise<string> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata?.role as string) ?? 'learner';
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({ unauthenticatedUrl: new URL('/courses/sign-in', req.url).toString() });
  }

  if (isAdminOnlyRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const role = await getUserRole(userId);
    if (role !== 'admin') {
      if (req.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/courses/dashboard', req.url));
    }
  }

  if (isInstructorRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const role = await getUserRole(userId);
    if (role !== 'admin' && role !== 'instructor') {
      return NextResponse.redirect(new URL('/courses/dashboard', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
