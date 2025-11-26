import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAssignments } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { differenceInDays, formatDistanceToNowStrict } from "date-fns";
import { FileText, ClipboardCheck, Presentation } from "lucide-react";

export function UpcomingAssignments() {
  const sortedAssignments = mockAssignments
    .filter((a) => !a.completed)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const getIcon = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes("essay") || lowerCaseTitle.includes("report")) return <FileText className="size-4 text-muted-foreground" />;
    if (lowerCaseTitle.includes("prep") || lowerCaseTitle.includes("set") || lowerCaseTitle.includes("quiz")) return <ClipboardCheck className="size-4 text-muted-foreground" />;
    if (lowerCaseTitle.includes("presentation")) return <Presentation className="size-4 text-muted-foreground" />;
    return <FileText className="size-4 text-muted-foreground" />;
  };

  const getPriorityBadgeVariant = (priority: 'low' | 'medium' | 'high') => {
    switch(priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  }

  const getDueDateInfo = (dueDate: Date) => {
    const days = differenceInDays(dueDate, new Date());
    if (days < 0) return { text: "Overdue", className: "text-destructive font-semibold" };
    if (days < 1) return { text: "Due today", className: "text-accent-foreground font-semibold" };
    if (days < 2) return { text: "Due tomorrow", className: "text-foreground font-semibold" };
    return { text: `Due in ${formatDistanceToNowStrict(dueDate)}`, className: "text-muted-foreground" };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assignments</CardTitle>
        <CardDescription>
          Here's what's on your plate. Stay focused and productive!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedAssignments.slice(0, 4).map((assignment) => {
            const dueDateInfo = getDueDateInfo(assignment.dueDate);
            return (
              <div
                key={assignment.id}
                className="flex items-center gap-4 p-2 rounded-lg transition-colors hover:bg-muted/50"
              >
                <div className="bg-muted p-3 rounded-lg">{getIcon(assignment.title)}</div>
                <div className="flex-1 grid gap-1">
                  <p className="font-medium leading-none">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.course}</p>
                </div>
                <div className="text-right">
                    <p className={cn("text-sm font-medium", dueDateInfo.className)}>{dueDateInfo.text}</p>
                    <Badge variant={getPriorityBadgeVariant(assignment.priority)} className="capitalize mt-1">{assignment.priority}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
