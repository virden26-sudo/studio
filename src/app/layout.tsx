import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { AssignmentsProvider } from '@/context/assignments-context';
import { GradesProvider } from '@/context/grades-context';
import { Suspense } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import type { User } from '@/lib/types';
import { DashboardPage } from '@/components/dashboard/dashboard-page';

export const metadata: Metadata = {
  title: 'Agenda+',
  description: 'Your intelligent student agenda.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense>
          <AssignmentsProvider>
            <GradesProvider>
              <AppShell>
                {children}
              </AppShell>
            </GradesProvider>
          </AssignmentsProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
