import { AppShell } from '@/components/layout/app-shell';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import type { User } from '@/lib/types';

export default function Home({ user }: { user: User | null }) {
  return (
    <AppShell pageTitle="Dashboard">
      <DashboardPage user={user}/>
    </AppShell>
  );
}
