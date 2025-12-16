'use server';

/**
 * @fileOverview A flow that parses syllabus text to extract assignments.
 *
 * - parseSyllabusText - A function that parses raw syllabus text.
 * - ParseSyllabusTextInput - The input type for the function.
 * - ParseSyllabusTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AssignmentSchema } from '@/ai/schemas/assignment';

const ParseSyllabusTextInputSchema = z.object({
  syllabusText: z
    .string()
    .describe(
      "The raw text content of a course syllabus."
    ),
});
export type ParseSyllabusTextInput = z.infer<typeof ParseSyllabusTextInputSchema>;

const ParseSyllabusTextOutputSchema = z.object({
    assignments: z.array(AssignmentSchema)
});
export type ParseSyllabusTextOutput = z.infer<typeof ParseSyllabusTextOutputSchema>;

export async function parseSyllabusText(input: ParseSyllabusTextInput): Promise<ParseSyllabusTextOutput> {
  return parseSyllabusTextFlow(input);
}

const parseSyllabusTextPrompt = ai.definePrompt({
  name: 'parseSyllabusTextPrompt',
  input: {schema: ParseSyllabusTextInputSchema},
  output: {schema: ParseSyllabusTextOutputSchema},
  prompt: `You are an expert AI assistant that extracts a structured list of assignments, exams, and discussions from raw syllabus text.

  The output should be a JSON object containing an 'assignments' array. Each object in the array should have the following keys:
  - task: The title or name of the task.
  - dueDate: The due date of the assignment in ISO format (YYYY-MM-DD). If no year is specified, assume the current year.
  - course: The course the assignment is for, if specified.
  - details: Any additional details about the assignment, if specified.
  
  Today's date is {{currentDate}}.

  Carefully read the provided syllabus text and identify all assignments, quizzes, exams, discussions, and projects.

  Syllabus Text:
  {{{syllabusText}}}
  `,
});

const parseSyllabusTextFlow = ai.defineFlow(
  {
    name: 'parseSyllabusTextFlow',
    inputSchema: ParseSyllabusTextInputSchema,
    outputSchema: ParseSyllabusTextOutputSchema,
  },
  async input => {
    const {output} = await parseSyllabusTextPrompt({
        ...input,
        currentDate: new Date().toLocaleDateString('en-CA'),
    });
    return output!;
  }
);
