"use client";

import type { User } from "@/lib/types";
import { useAssignments } from "@/context/assignments-context";

export function WelcomeHeader({ user }: { user?: User | null }) {
  const { assignments, loading } = useAssignments();
  
  if (!user) {
    return null;
  }

  const upcomingCount = loading ? 0 : assignments.filter(
    (a) => !a.completed && a.dueDate > new Date()
  ).length;

  const name = user.name.split(" ")[0];
  
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">
        Welcome back, {name}!
      </h1>
      <p className="text-muted-foreground">
        {loading ? 'Loading your agenda...' : upcomingCount > 0 
          ? `You have ${upcomingCount} upcoming assignment${upcomingCount > 1 ? 's' : ''}. Keep up the great work.`
          : `You have no upcoming assignments. Great job!`}
      </p>
    </div>
  );
}
