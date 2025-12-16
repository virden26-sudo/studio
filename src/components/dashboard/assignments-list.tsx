
"use client";

import { useState } from "react";
import { useAssignments } from "@/context/assignments-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { differenceInDays, formatDistanceToNowStrict } from 'date-fns';
import { CircleOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Assignment } from "@/lib/types";

export function AssignmentsList() {
    const { assignments, toggleAssignment, loading } = useAssignments();

    const upcomingAssignments = assignments.filter(a => !a.completed).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    const completedAssignments = assignments.filter(a => a.completed).sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());

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

    const AssignmentRow = ({ assignment }: { assignment: Assignment }) => {
        const dueDateInfo = getDueDateInfo(assignment.dueDate);
        return (
            <TableRow key={assignment.id}>
                <TableCell className="w-10">
                    <Checkbox
                        checked={assignment.completed}
                        onCheckedChange={() => toggleAssignment(assignment.id)}
                        aria-label="Toggle assignment completion"
                    />
                </TableCell>
                <TableCell>
                    <div className="font-medium">{assignment.title}</div>
                    <div className="text-sm text-muted-foreground">{assignment.course}</div>
                </TableCell>
                <TableCell>
                    <p className={cn("text-sm font-medium", dueDateInfo.className)}>{dueDateInfo.text}</p>
                </TableCell>
                <TableCell className="text-right">
                    <Badge variant={getPriorityBadgeVariant(assignment.priority)} className="capitalize">{assignment.priority}</Badge>
                </TableCell>
            </TableRow>
        )
    };
    
    const AssignmentsTable = ({ assignments }: { assignments: Assignment[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Priority</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {assignments.map(assignment => <AssignmentRow key={assignment.id} assignment={assignment} />)}
            </TableBody>
        </Table>
    );

    const NoAssignments = ({title}: {title: string}) => (
        <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <CircleOff className="size-10 mb-4" />
            <p className="font-semibold">{title}</p>
        </div>
    );

    if (loading) {
        return <div>Loading assignments...</div>
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-gradient">Upcoming Assignments</CardTitle>
                    <CardDescription>Everything you need to get done. You can do it!</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingAssignments.length > 0 ? (
                        <AssignmentsTable assignments={upcomingAssignments} />
                    ) : (
                        <NoAssignments title="No upcoming assignments!" />
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-gradient">Completed</CardTitle>
                    <CardDescription>Look at all you've accomplished. Great work!</CardDescription>
                </CardHeader>
                <CardContent>
                    {completedAssignments.length > 0 ? (
                        <AssignmentsTable assignments={completedAssignments} />
                    ) : (
                        <NoAssignments title="No completed assignments yet." />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
