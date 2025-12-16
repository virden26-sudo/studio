
"use client";

import { WelcomeHeader } from "./welcome-header";
import { UpcomingAssignments } from "./upcoming-assignments";
import { GradeOverview } from "./grade-overview";
import { CalendarView } from "./calendar-view";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { LiveSessionCard } from "./live-session-card";

type DashboardPageProps = {
  user?: User | null;
  setImportSyllabusOpen?: (open: boolean) => void;
};

export function DashboardPage({ user, setImportSyllabusOpen }: DashboardPageProps) {
  
  const router = useRouter();
 
  return (
    <div className="flex flex-col gap-6">
      {user && <WelcomeHeader user={user} />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <UpcomingAssignments />
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
