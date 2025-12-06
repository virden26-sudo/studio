"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { parseSyllabus } from "@/ai/flows/syllabus-parser";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAssignments } from "@/context/assignments-context";
import type { ParsedAssignment } from "@/lib/types";


const formSchema = z.object({
  syllabusText: z.string().min(1, "Please paste your syllabus text."),
});

type ImportSyllabusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImportSyllabusDialog({ open, onOpenChange }: ImportSyllabusDialogProps) {
  const { toast } = useToast();
  const { addMultipleAssignments } = useAssignments();
  const [isParsing, setIsParsing] = useState(false);
  const [parsedAssignments, setParsedAssignments] = useState<ParsedAssignment[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { syllabusText: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsParsing(true);
    setParsedAssignments(null);
    try {
      const result = await parseSyllabus({ syllabusText: values.syllabusText });
      setParsedAssignments(result.assignments);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not parse syllabus. Please try again.",
      });
    } finally {
      setIsParsing(false);
    }
  }
  
  const handleSave = () => {
    if (!parsedAssignments) return;
    
    addMultipleAssignments(parsedAssignments);

    toast({
        title: "Assignments Imported!",
        description: `${parsedAssignments.length} assignments have been added to your schedule.`,
    });
    handleClose();
  }

  const handleClose = () => {
    form.reset();
    setParsedAssignments(null);
    onOpenChange(false);
  }

  const handleAssignmentChange = (index: number, field: keyof ParsedAssignment, value: string) => {
    if (!parsedAssignments) return;
    const newAssignments = [...parsedAssignments];
    newAssignments[index] = { ...newAssignments[index], [field]: value };
    setParsedAssignments(newAssignments);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => {
        if(isParsing) e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Import from Syllabus
          </DialogTitle>
          <DialogDescription>
            Paste your syllabus text below and let AI extract all your assignments.
          </DialogDescription>
        </DialogHeader>
        {!parsedAssignments ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="syllabusText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Syllabus Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full text from your syllabus file here..."
                        {...field}
                        rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isParsing}>
                  {isParsing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="mr-2 h-4 w-4" />
                  )}
                  Parse with AI
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4 pt-4">
            <h3 className="font-semibold">Extracted Assignments</h3>
            <ScrollArea className="h-72">
              <div className="space-y-4 pr-6">
                {parsedAssignments.map((assignment, index) => (
                  <Card key={index} className="p-4">
                      <div className="space-y-2">
                          <Label htmlFor={`task-${index}`}>Task</Label>
                          <Input id={`task-${index}`} value={assignment.task} onChange={(e) => handleAssignmentChange(index, 'task', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-2">
                              <Label htmlFor={`course-${index}`}>Course</Label>
                              <Input id={`course-${index}`} value={assignment.course} onChange={(e) => handleAssignmentChange(index, 'course', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor={`dueDate-${index}`}>Due Date</Label>
                              <Input id={`dueDate-${index}`} type="date" value={assignment.dueDate} onChange={(e) => handleAssignmentChange(index, 'dueDate', e.target.value)} />
                          </div>
                      </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
             <DialogFooter>
                <Button variant="ghost" onClick={() => { setParsedAssignments(null); setIsParsing(false); }}>Back</Button>
                <Button onClick={handleSave}>Save {parsedAssignments.length} Assignments</Button>
              </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
