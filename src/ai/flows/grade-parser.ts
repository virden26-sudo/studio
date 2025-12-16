'use server';

/**
 * @fileOverview A flow that parses grade information from raw text.
 *
 * - parseGrades - A function that parses raw grades text.
 * - ParseGradesInput - The input type for the function.
 * - ParseGradesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CourseSchema } from '@/ai/schemas/course';

const ParseGradesInputSchema = z.object({
  gradesText: z
    .string()
    .describe(
      "The raw text content of a student's grades page."
    ),
});
export type ParseGradesInput = z.infer<typeof ParseGradesInputSchema>;

const ParseGradesOutputSchema = z.object({
    courses: z.array(CourseSchema)
});
export type ParseGradesOutput = z.infer<typeof ParseGradesOutputSchema>;

export async function parseGrades(input: ParseGradesInput): Promise<ParseGradesOutput> {
  return parseGradesFlow(input);
}

const parseGradesTextPrompt = ai.definePrompt({
  name: 'parseGradesTextPrompt',
  input: {schema: ParseGradesInputSchema},
  output: {schema: ParseGradesOutputSchema},
  prompt: `You are an expert AI assistant that extracts a structured list of courses and grades from raw text copied from a student's grade portal.

  The output should be a JSON object containing a 'courses' array. Each object in the array should have the following keys:
  - name: The name of the course.
  - grade: The numerical grade for the course. If the grade is represented as points (e.g., "450 / 500"), calculate the percentage.

  Carefully read the provided text and identify all courses and their corresponding grades. Ignore courses that do not have a grade yet.

  Grades Text:
  {{{gradesText}}}
  `,
});

const parseGradesFlow = ai.defineFlow(
  {
    name: 'parseGradesFlow',
    inputSchema: ParseGradesInputSchema,
    outputSchema: ParseGradesOutputSchema,
  },
  async input => {
    const {output} = await parseGradesTextPrompt(input);
    return output!;
  }
);
