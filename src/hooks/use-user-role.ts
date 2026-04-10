"use client"
import { useUser } from '@clerk/nextjs';
import type { UserRole } from '@/lib/auth';

export function useUserRole(): { role: UserRole; isLoaded: boolean; userId: string | null | undefined } {
  const { user, isLoaded } = useUser();

  const role = (user?.publicMetadata?.role as UserRole) ?? 'learner';

  return { role, isLoaded, userId: user?.id };
}
