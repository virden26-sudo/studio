"use client";

import { WelcomeHeader } from "./welcome-header";
import { UpcomingAssignments } from "./upcoming-assignments";
import { GradeOverview } from "./grade-overview";
import { CalendarView } from "./calendar-view";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  return (
    <>
      <WelcomeHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <UpcomingAssignments />
          <CalendarView />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GradeOverview />
          <Card>
            <CardHeader>
              <CardTitle>Connect to University</CardTitle>
              <CardDescription>Import your assignments automatically.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Link your student account to sync your courses and due dates directly from your university's portal.
              </p>
              <Button className="w-full">Connect & Sync</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Academic Support</CardTitle>
                <CardDescription>Get help when you need it.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Connect with your university's resources for academic support and tutoring.</p>
                <Button className="w-full" variant="secondary">Visit Learning Center</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
