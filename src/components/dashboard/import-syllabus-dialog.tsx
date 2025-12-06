
"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { parseSyllabus } from "@/ai/flows/syllabus-parser";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { useAssignments } from "@/context/assignments-context";

type ImportSyllabusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImportSyllabusDialog({ open, onOpenChange }: ImportSyllabusDialogProps) {
  const { toast } = useToast();
  const { addMultipleAssignments } = useAssignments();
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function handleFileParse(file: File) {
    setIsParsing(true);
    setFileName(file.name);
    try {
      const dataUri = await fileToDataUri(file);
      const result = await parseSyllabus({ syllabusFile: dataUri });
      
      if (result.assignments && result.assignments.length > 0) {
        addMultipleAssignments(result.assignments);
        toast({
          title: "Assignments Imported!",
          description: `${result.assignments.length} items have been automatically added to your schedule.`,
        });
        window.location.reload();
      } else {
        toast({
            variant: "default",
            title: "No assignments found",
            description: "The AI couldn't find any assignments in this file. You can try another file.",
        });
      }
      handleClose(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not parse syllabus. Please try again.",
      });
      setIsParsing(false); // Only stop parsing on error, otherwise handleClose does it.
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileParse(file);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setIsParsing(false);
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
        if(isParsing) e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Import from Syllabus
          </DialogTitle>
          <DialogDescription>
            Upload your syllabus and let AI automatically extract all your coursework.
          </DialogDescription>
        </DialogHeader>
        
        {isParsing ? (
           <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p className="mt-2 text-muted-foreground">AI is parsing "{fileName}"...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
           </div>
        ) : (
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
                  accept=".pdf,.doc,.docx,.txt"
                />
              </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
