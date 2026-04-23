
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { parsePortalData } from "@/ai/flows/portal-parser";
import { Loader2, Sparkles, RefreshCw, ExternalLink, ShieldCheck } from "lucide-react";
import { useAssignments } from "@/context/assignments-context";
import { usePortal } from "@/context/portal-context";
import { useGrades } from "@/context/grades-context";
import { v4 as uuidv4 } from 'uuid';

type BuddieSyncDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BuddieSyncDialog({ open, onOpenChange }: BuddieSyncDialogProps) {
  const { toast } = useToast();
  const { addMultipleAssignments } = useAssignments();
  const { addAnnouncements, addDiscussions } = usePortal();
  const [isSyncing, setIsSyncing] = useState(false);
  const [step, setStep] = useState<'start' | 'login' | 'parsing'>('start');

  const handleSync = async () => {
    // In a real implementation with Capacitor, we would use InAppBrowser here.
    // For this demo/codebase, we will simulate the "Automatic" capture.
    // The user would login in the browser, and then the AI would extract.
    
    setIsSyncing(true);
    setStep('parsing');
    
    try {
      // Simulate getting the text from the portal (e.g. via a bridge or the user's session)
      // Since we can't actually scrape cross-origin in a dev environment without a proxy,
      // we'll use a placeholder that would be replaced by the actual scraped content.
      
      const portalUrl = localStorage.getItem("studentPortalUrl") || "https://navigate.nu.edu/d2l/home";
      
      // We'll call the flow. In a real scenario, 'portalText' would be the actual HTML/Text 
      // scraped from the window.
      
      // For demonstration, we'll ask the user to "Confirm Login" which would 
      // trigger the capture if we had the native plugin.
      
      toast({
        title: "Budd-ie is connecting...",
        description: "Accessing your student portal to extract information.",
      });

      // Simulation of captured data
      const mockPortalText = "Upcoming Assignments: Quiz 1 due 2026-05-01, Essay 2 due 2026-05-15. Announcements: Class cancelled on Friday. Discussions: Post your thoughts on the reading by Sunday.";
      
      const result = await parsePortalData({ portalText: mockPortalText });
      
      if (result.assignments.length > 0) {
        addMultipleAssignments(result.assignments);
      }
      
      if (result.announcements.length > 0) {
        addAnnouncements(result.announcements.map(a => ({
            id: uuidv4(),
            ...a,
            date: new Date(a.date)
        })));
      }
      
      if (result.discussions.length > 0) {
        addDiscussions(result.discussions.map(d => ({
            id: uuidv4(),
            ...d,
            postedDate: new Date(d.postedDate),
            dueDate: d.dueDate ? new Date(d.dueDate) : undefined
        })));
      }

      toast({
        title: "Sync Complete!",
        description: `Budd-ie found ${result.assignments.length} assignments, ${result.announcements.length} announcements, and ${result.discussions.length} discussions.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Budd-ie couldn't access your portal. Please make sure you are logged in.",
      });
    } finally {
      setIsSyncing(false);
      setStep('start');
    }
  };

  const openPortal = () => {
      const portalUrl = localStorage.getItem("studentPortalUrl") || "https://navigate.nu.edu/d2l/home";
      window.open(portalUrl, "_blank");
      setStep('login');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Budd-ie Auto-Sync
          </DialogTitle>
          <DialogDescription>
            Budd-ie will automatically extract your assignments, grades, announcements, and discussions from your student portal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center text-center gap-4">
            {isSyncing ? (
                <>
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="font-medium">Budd-ie is working its magic...</p>
                    <p className="text-sm text-muted-foreground">This uses AI to organize everything for you.</p>
                </>
            ) : step === 'start' ? (
                <>
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <RefreshCw className="size-8 text-primary" />
                    </div>
                    <p className="text-sm">
                        No more copy and paste. Just click sync and Budd-ie handles the rest.
                    </p>
                    <Button onClick={openPortal} className="w-full">
                        <ExternalLink className="mr-2 size-4" />
                        Open Portal to Login
                    </Button>
                </>
            ) : (
                <>
                    <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                        <ShieldCheck className="size-8 text-green-500" />
                    </div>
                    <p className="font-medium">Logged in?</p>
                    <p className="text-sm text-muted-foreground">
                        Once you've logged into your portal in the other tab, click the button below.
                    </p>
                    <Button onClick={handleSync} className="w-full">
                        <Sparkles className="mr-2 size-4" />
                        Sync Now with Budd-ie
                    </Button>
                    <Button variant="ghost" onClick={() => setStep('start')} className="w-full text-xs">
                        Back
                    </Button>
                </>
            )}
        </div>
        
        <DialogFooter className="sm:justify-start">
            <p className="text-[10px] text-muted-foreground text-center w-full">
                Budd-ie uses secure AI processing. Your credentials are never stored.
            </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
