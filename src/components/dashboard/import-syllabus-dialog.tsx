"use client";

import { useState, useRef } from "react";
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
import { parseSyllabus } from "@/ai/flows/syllabus-parser";
import { Bot, Loader2, Sparkles, Upload } from "lucide-react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAssignments } from "@/context/assignments-context";
import type { ParsedAssignment } from "@/lib/types";

type ImportSyllabusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImportSyllabusDialog({ open, onOpenChange }: ImportSyllabusDialogProps) {
  const { toast } = useToast();
  const { addMultipleAssignments } = useAssignments();
  const [isParsing, setIsParsing] = useState(false);
  const [parsedAssignments, setParsedAssignments] = useState<ParsedAssignment[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);


  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFileParse(file: File) {
    setIsParsing(true);
    setParsedAssignments(null);
    setFileName(file.name);
    try {
      const dataUri = await fileToDataUri(file);
      const result = await parseSyllabus({ syllabusFile: dataUri });
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileParse(file);
    }
  };
  
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
    setParsedAssignments(null);
    setFileName(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
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
            Upload your syllabus file and let AI extract all your assignments.
          </DialogDescription>
        </DialogHeader>
        {!parsedAssignments && !isParsing ? (
            <div className="pt-4">
              <div
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">Any document file (PDF, DOCX, TXT, etc.)</p>
                </div>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
        ) : isParsing ? (
           <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p className="mt-2 text-muted-foreground">AI is parsing "{fileName}"...</p>
           </div>
        ) : (
          <div className="space-y-4 pt-4">
            <h3 className="font-semibold">Extracted Assignments from <span className="text-primary">{fileName}</span></h3>
            <ScrollArea className="h-72">
              <div className="space-y-4 pr-6">
                {parsedAssignments && parsedAssignments.map((assignment, index) => (
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
                 {parsedAssignments && parsedAssignments.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                        <p className="font-semibold">No assignments found.</p>
                        <p className="text-sm">The AI couldn't find any assignments in this file. You can try another file.</p>
                    </div>
                )}
              </div>
            </ScrollArea>
             <DialogFooter>
                <Button variant="ghost" onClick={() => { setParsedAssignments(null); setIsParsing(false); setFileName(null); }}>Back</Button>
                {parsedAssignments && parsedAssignments.length > 0 && <Button onClick={handleSave}>Save {parsedAssignments.length} Assignments</Button>}
              </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
