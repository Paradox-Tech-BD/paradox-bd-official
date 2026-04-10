import { auth, currentUser } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'instructor' | 'learner';

export async function getUserRole(userId?: string): Promise<UserRole> {
  if (userId) {
    const { createClerkClient } = await import('@clerk/nextjs/server');
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const user = await clerk.users.getUser(userId);
    return (user.publicMetadata?.role as UserRole) ?? 'learner';
  }

  const { userId: currentUserId } = await auth();
  if (!currentUserId) return 'learner';

  const user = await currentUser();
  return (user?.publicMetadata?.role as UserRole) ?? 'learner';
}

export async function requireRole(requiredRole: UserRole): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const role = await getUserRole(userId);

  if (requiredRole === 'admin' && role !== 'admin') {
    throw new Error('Forbidden: admin access required');
  }

  if (requiredRole === 'instructor' && role !== 'admin' && role !== 'instructor') {
    throw new Error('Forbidden: instructor access required');
  }

  return userId;
}
