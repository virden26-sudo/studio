import { mockUser } from "@/lib/mock-data";
import { mockAssignments } from "@/lib/mock-data";

export function WelcomeHeader() {
  const upcomingCount = mockAssignments.filter(
    (a) => !a.completed && a.dueDate > new Date()
  ).length;
  
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Welcome back, {mockUser.name.split(" ")[0]}!
      </h1>
      <p className="text-muted-foreground">
        {upcomingCount > 0 
          ? `You have ${upcomingCount} upcoming assignment${upcomingCount > 1 ? 's' : ''}. Keep up the great work.`
          : `You have no upcoming assignments. Great job!`}
      </p>
    </div>
  );
}
