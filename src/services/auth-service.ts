import type { User } from "@/declarations/backend/backend.did";
import { useAuth } from "@/contexts/AuthContext";

export function useGetCurrentUser(): { user: User | null; loading: boolean } {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return { user: null, loading };
  }

  return { user, loading };
}
