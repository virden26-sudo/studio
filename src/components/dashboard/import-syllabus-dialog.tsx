
"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { parseSyllabus } from "@/ai/flows/syllabus-parser";
import { parseSyllabusText } from "@/ai/flows/syllabus-text-parser";
import { Loader2, Sparkles, Upload, FileText, ExternalLink } from "lucide-react";
import { useAssignments } from "@/context/assignments-context";
import type { ParsedAssignment } from "@/lib/types";
import Link from "next/link";

type ImportSyllabusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImportSyllabusDialog({ open, onOpenChange }: ImportSyllabusDialogProps) {
  const { toast } = useToast();
  const { addMultipleAssignments } = useAssignments();
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAssignmentsParsed = (assignments: ParsedAssignment[]) => {
     if (assignments && assignments.length > 0) {
        addMultipleAssignments(assignments);
        toast({
          title: "Assignments Imported!",
          description: `${assignments.length} items have been automatically added to your schedule.`,
        });
      } else {
        toast({
            variant: "default",
            title: "No assignments found",
            description: "The AI couldn't find any assignments. You can try another file or paste the text directly.",
        });
      }
      handleClose(false);
  }

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
      handleAssignmentsParsed(result.assignments);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not parse syllabus file. Please try again.",
      });
      setIsParsing(false);
    }
  }

  const handleTextParse = async () => {
    if (!pastedText.trim()) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please paste your syllabus text.",
        });
        return;
    }
    setIsParsing(true);
    setFileName("pasted text");
    try {
        const result = await parseSyllabusText({ syllabusText: pastedText });
        handleAssignmentsParsed(result.assignments);
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not parse syllabus text. Please try again.",
        });
        setIsParsing(false);
    }
  };

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
      setPastedText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    onOpenChange(isOpen);
  }

  const handlePortalClick = () => {
    window.open("https://navigate.nu.edu/d2l/home/23776", "_blank");
  };

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
            Upload a syllabus file or paste the text to automatically extract your coursework.
          </DialogDescription>
        </DialogHeader>
        
        {isParsing ? (
           <div className="flex flex-col items-center justify-center h-60">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p className="mt-2 text-muted-foreground">AI is parsing "{fileName}"...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
           </div>
        ) : (
            <Tabs defaultValue="paste" className="pt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paste">
                  <FileText className="mr-2" /> Paste Text
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="mr-2" /> Upload File
                </TabsTrigger>
              </TabsList>
              <TabsContent value="paste" className="mt-4">
                <div className="space-y-2">
                  <div className="flex justify-end">
                      <Button variant="link" className="h-auto p-0 text-xs" onClick={handlePortalClick}>
                          <ExternalLink className="mr-1 size-3"/>
                          Browse for Syllabus
                      </Button>
                  </div>
                  <Textarea
                    placeholder="Paste your syllabus content here..."
                    className="h-48 resize-none"
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                  />
                  <Button className="w-full" onClick={handleTextParse}>
                    <Sparkles className="mr-2" /> Parse Pasted Text
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="upload" className="mt-4">
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
              </TabsContent>
            </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
