"use client";

import { WelcomeHeader } from "./welcome-header";
import { UpcomingAssignments } from "./upcoming-assignments";
import { GradeOverview } from "./grade-overview";
import { CalendarView } from "./calendar-view";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";

type DashboardPageProps = {
  user?: User | null;
  setImportSyllabusOpen?: (open: boolean) => void;
};

export function DashboardPage({ user, setImportSyllabusOpen }: DashboardPageProps) {
  
  const router = useRouter();

  const handleAleksClick = () => {
    window.open("https://www.aleks.com/", "_blank");
  };
  
  const handleLearningCenterClick = () => {
    window.open("https://www.nu.edu/students/academic-success-center/", "_blank");
  };

  return (
    <div className="flex flex-col gap-6">
      <WelcomeHeader user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <UpcomingAssignments />
          <div className="cursor-pointer" onClick={() => router.push('/calendar')}>
            <CalendarView />
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GradeOverview />
          <Card>
            <CardHeader>
              <CardTitle className="text-gradient">Connect to University</CardTitle>
              <CardDescription>Import your assignments automatically.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Link your student account to sync your courses and due dates directly from your university's portal.
              </p>
              <Button className="w-full" onClick={() => setImportSyllabusOpen?.(true)}>Connect & Sync</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="text-gradient">Connect to ALEKS</CardTitle>
                <CardDescription>Access your math and chemistry assignments.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Go to the ALEKS website to complete your interactive assignments.</p>
                <Button className="w-full" onClick={handleAleksClick}>Go to ALEKS</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle className="text-gradient">Academic Support</CardTitle>
                <CardDescription>Get help when you need it.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Connect with your university's resources for academic support and tutoring.</p>
                <Button className="w-full" variant="secondary" onClick={handleLearningCenterClick}>Visit Learning Center</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}