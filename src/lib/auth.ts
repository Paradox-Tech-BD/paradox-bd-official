import { auth, currentUser } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'instructor' | 'learner';

export async function getUserRole(userId?: string): Promise<UserRole> {
  // Prefer session claims when available to avoid extra API calls.
  try {
    const { sessionClaims } = await auth();
    const roleFromClaims = (sessionClaims as any)?.publicMetadata?.role as UserRole | undefined;
    if (roleFromClaims) return roleFromClaims;
  } catch {
    // ignore
  }

  if (userId) {
    try {
      const secretKey = process.env.CLERK_SECRET_KEY;
      if (secretKey) {
        const { createClerkClient } = await import('@clerk/nextjs/server');
        const clerk = createClerkClient({ secretKey });
        const user = await clerk.users.getUser(userId);
        return (user.publicMetadata?.role as UserRole) ?? 'learner';
      }
    } catch {
      // ignore
    }
  }

  try {
    const user = await currentUser();
    return (user?.publicMetadata?.role as UserRole) ?? 'learner';
  } catch {
    return 'learner';
  }
}

export async function requireRole(requiredRole: UserRole): Promise<string> {
  let userId: string | null = null;
  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch {
    userId = null;
  }
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
