import { useSupabase } from '@/providers/supabase-provider';
import { LandingPage } from './landing-page';
import { AppLayout } from './app-layout';

export function RootPage() {
  const { user, isLoading } = useSupabase();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <LandingPage />;
  }

  return <AppLayout />;
}