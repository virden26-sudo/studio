
"use client";

import { WelcomeHeader } from "./welcome-header";
import { UpcomingAssignments } from "./upcoming-assignments";
import { GradeOverview } from "./grade-overview";
import { CalendarView } from "./calendar-view";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { LiveSessionCard } from "./live-session-card";
import { usePortal } from "@/context/portal-context";
import { Megaphone } from "lucide-react";

type DashboardPageProps = {
  user?: User | null;
  setImportSyllabusOpen?: (open: boolean) => void;
};

export function DashboardPage({ user, setImportSyllabusOpen }: DashboardPageProps) {
  
  const router = useRouter();
  const { announcements } = usePortal();
  const latestAnnouncements = announcements.slice(0, 2);
 
  return (
    <div className="flex flex-col gap-6">
      {user && <WelcomeHeader user={user} />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <UpcomingAssignments />
          {latestAnnouncements.length > 0 && (
            <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Megaphone className="size-4 text-primary" />
                    Recent Announcements
                </h3>
                <div className="space-y-4">
                    {latestAnnouncements.map(a => (
                        <div key={a.id} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                            <div className="font-medium">{a.title}</div>
                            <div className="text-muted-foreground line-clamp-1">{a.content}</div>
                        </div>
                    ))}
                </div>
            </div>
          )}
          <div className="cursor-pointer" onClick={() => router.push('/calendar')}>
            <CalendarView />
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GradeOverview />
          <LiveSessionCard />
        </div>
      </div>
    </div>
  );
}
