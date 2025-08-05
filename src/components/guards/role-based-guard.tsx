import { useUser } from '@/hooks/use-user';
import type { Profile } from '@/hooks/use-user';

interface RoleBasedGuardProps {
  roles: Array<Profile['role']>;
  children: React.ReactNode;
}

export const RoleBasedGuard = ({ roles, children }: RoleBasedGuardProps) => {
  const { profile, loading } = useUser();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!profile || !roles.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
};
