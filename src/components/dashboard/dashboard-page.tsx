"use client";

import { WelcomeHeader } from "./welcome-header";
import { UpcomingAssignments } from "./upcoming-assignments";
import { GradeOverview } from "./grade-overview";
import { CalendarView } from "./calendar-view";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type DashboardPageProps = {
  user?: User | null;
  setImportSyllabusOpen?: (open: boolean) => void;
};

export function DashboardPage({ user, setImportSyllabusOpen }: DashboardPageProps) {
  
  const router = useRouter();
  const [portalUrl, setPortalUrl] = useState("https://navigate.nu.edu/d2l/home");

  useEffect(() => {
    const savedUrl = localStorage.getItem("studentPortalUrl");
    if (savedUrl) {
      setPortalUrl(savedUrl);
    }
  }, []);

  const handlePortalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPortalUrl(e.target.value);
  }

  const handleSavePortalUrl = () => {
    localStorage.setItem("studentPortalUrl", portalUrl);
    window.open(portalUrl, "_blank");
  }

  const handleAleksClick = () => {
    window.open("https://www.aleks.com/", "_blank");
  };
  
  const handleLearningCenterClick = () => {
    window.open("https://www.nu.edu/students/academic-success-center/", "_blank");
  };

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
          <Card>
            <CardHeader>
              <CardTitle className="text-gradient">Student Portal</CardTitle>
              <CardDescription>Access your university's resources.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="portal-url">Portal URL</Label>
                <Input 
                  id="portal-url" 
                  value={portalUrl}
                  onChange={handlePortalUrlChange}
                  placeholder="https://my.school.edu"
                />
              </div>
              <Button className="w-full" onClick={handleSavePortalUrl}>Go to Portal</Button>
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
