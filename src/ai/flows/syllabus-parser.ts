'use server';

/**
 * @fileOverview A flow that parses a syllabus to extract assignments.
 *
 * - parseSyllabus - A function that parses syllabus text.
 * - ParseSyllabusInput - The input type for the parseSyllabus function.
 * - ParseSyllabusOutput - The return type for the parseSyllabus function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';
import { ParseAssignmentOutputSchema } from '@/ai/schemas';

const ParseSyllabusInputSchema = z.object({
  syllabusFile: z
    .string()
    .describe(
      "A syllabus file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseSyllabusInput = z.infer<typeof ParseSyllabusInputSchema>;

const ParseSyllabusOutputSchema = z.object({
    assignments: z.array(ParseAssignmentOutputSchema)
});
export type ParseSyllabusOutput = z.infer<typeof ParseSyllabusOutputSchema>;

export async function parseSyllabus(input: ParseSyllabusInput): Promise<ParseSyllabusOutput> {
  return parseSyllabusFlow(input);
}

const parseSyllabusPrompt = ai.definePrompt({
  name: 'parseSyllabusPrompt',
  input: {schema: ParseSyllabusInputSchema},
  output: {schema: ParseSyllabusOutputSchema},
  model: googleAI('gemini-1.5-flash'),
  prompt: `You are an expert AI assistant that extracts a structured list of assignments, exams, and discussions from a course syllabus.

  The output should be a JSON object containing an 'assignments' array. Each object in the array should have the following keys:
  - task: The title or name of the task.
  - dueDate: The due date of the assignment in ISO format (YYYY-MM-DD). Use the current year.
  - course: The course the assignment is for, if specified.
  - details: Any additional details about the assignment, if specified.

  Carefully read the provided syllabus document and identify all assignments, quizzes, exams, discussions, and projects.

  Syllabus Document:
  {{media url=syllabusFile}}
  `,
});

const parseSyllabusFlow = ai.defineFlow(
  {
    name: 'parseSyllabusFlow',
    inputSchema: ParseSyllabusInputSchema,
    outputSchema: ParseSyllabusOutputSchema,
  },
  async input => {
    const {output} = await parseSyllabusPrompt(input);
    return output!;
  }
);
