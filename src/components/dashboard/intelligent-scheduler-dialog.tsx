"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { suggestStudySchedule } from "@/ai/flows/intelligent-study-schedule-suggestions";
import { Loader2, Bot, Sparkles } from "lucide-react";
import { mockAssignments, mockSchedule } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

type IntelligentSchedulerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SuggestedScheduleItem = {
    day: string;
    startTime: string;
    endTime: string;
    assignment: string;
};

export function IntelligentSchedulerDialog({ open, onOpenChange }: IntelligentSchedulerDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{ suggestedSchedule: SuggestedScheduleItem[], reasoning: string } | null>(null);

  async function generateSchedule() {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestStudySchedule({
        schedule: JSON.stringify(mockSchedule),
        assignments: JSON.stringify(mockAssignments.filter(a => !a.completed)),
      });
      const parsedSchedule = JSON.parse(result.suggestedSchedule);
      setSuggestion({suggestedSchedule: parsedSchedule, reasoning: result.reasoning});
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate schedule. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleClose = () => {
    // Do not clear suggestion on close, so user can see it again.
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary"/>
            Intelligent Study Scheduler
          </DialogTitle>
          <DialogDescription>
            Let AI analyze your schedule and assignments to create an optimal study plan for you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Your Inputs</CardTitle>
                    <CardDescription>AI will consider these items.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 space-y-4">
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2 text-sm">Upcoming Assignments</h3>
                        <ScrollArea className="h-40 rounded-md border p-2 text-sm">
                           {mockAssignments.filter(a => !a.completed).map(a => <p key={a.id} className="truncate">{a.title}</p>)}
                        </ScrollArea>
                    </div>
                     <div className="flex-1">
                        <h3 className="font-semibold mb-2 text-sm">Your Schedule</h3>
                        <ScrollArea className="h-40 rounded-md border p-2 text-sm">
                           {mockSchedule.map(s => <p key={s.id} className="truncate">{s.title} ({s.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {s.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</p>)}
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
                <Button onClick={generateSchedule} disabled={isLoading} className="w-full">
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="mr-2 h-4 w-4" />
                  )}
                  {suggestion ? "Regenerate Study Plan" : "Generate Study Plan"}
                </Button>
                
                {isLoading && (
                    <div className="flex-1 flex flex-col items-center justify-center bg-muted/50 rounded-lg border border-dashed">
                        <Loader2 className="size-8 animate-spin text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">AI is creating your study plan...</p>
                    </div>
                )}
                
                {!isLoading && !suggestion && (
                    <div className="flex-1 flex flex-col items-center justify-center bg-muted/50 rounded-lg border border-dashed">
                        <p className="text-muted-foreground text-center p-4">Your suggested study plan will appear here.</p>
                    </div>
                )}
                
                {suggestion && !isLoading && (
                    <Card className="flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle>Suggested Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0">
                            <ScrollArea className="h-[350px]">
                                <h4 className="font-semibold mb-2">Schedule Blocks:</h4>
                                <div className="space-y-2 mb-4">
                                {suggestion.suggestedSchedule.map((item, index) => (
                                    <div key={index} className="p-2 border rounded-md bg-background text-sm">
                                        <p className="font-semibold text-primary">{item.assignment}</p>
                                        <p className="text-muted-foreground">{item.day}, {item.startTime} - {item.endTime}</p>
                                    </div>
                                ))}
                                </div>
                                <Separator className="my-4"/>
                                <h4 className="font-semibold mb-2">Reasoning from AI:</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.reasoning}</p>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
