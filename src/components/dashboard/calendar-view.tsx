import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAssignments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { format, isSameDay, addDays, startOfWeek, isToday } from 'date-fns';

export function CalendarView() {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    const assignmentsByDay = weekDays.map(day => ({
        day,
        assignments: mockAssignments.filter(a => isSameDay(a.dueDate, day) && !a.completed)
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>This Week's Deadlines</CardTitle>
                <CardDescription>
                    A look at your due dates for the upcoming week.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {assignmentsByDay.map(({ day, assignments }) => (
                        <div key={day.toString()} className={cn("rounded-lg p-2 min-h-32", isToday(day) ? "bg-primary/10 border-2 border-primary/50" : "bg-muted/50")}>
                            <div className="text-center">
                                <p className={cn("font-semibold text-sm", isToday(day) ? "text-primary" : "text-muted-foreground")}>{format(day, 'EEE')}</p>
                                <p className={cn("font-bold text-2xl", isToday(day) ? "text-primary" : "")}>{format(day, 'd')}</p>
                            </div>
                            <div className="mt-2 space-y-1">
                                {assignments.map(assignment => (
                                    <div key={assignment.id} className="text-xs p-1.5 rounded-md bg-background border border-primary/20 shadow-sm">
                                        <p className="font-semibold text-primary/80 truncate">{assignment.title}</p>
                                        <p className="text-muted-foreground truncate">{assignment.course}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
