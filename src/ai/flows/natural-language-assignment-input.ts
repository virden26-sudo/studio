'use server';

/**
 * @fileOverview A flow that parses natural language assignment input into structured data.
 *
 * - parseAssignment - A function that parses a natural language assignment description.
 * - ParseAssignmentInput - The input type for the parseAssignment function.
 * - ParseAssignmentOutput - The return type for the parseAssignment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AssignmentSchema, type Assignment } from '@/ai/schemas/assignment';

const ParseAssignmentInputSchema = z.object({
  assignmentText: z
    .string()
    .describe('A natural language description of an assignment.'),
});
export type ParseAssignmentInput = z.infer<typeof ParseAssignmentInputSchema>;
export type ParseAssignmentOutput = Assignment;


export async function parseAssignment(input: ParseAssignmentInput): Promise<ParseAssignmentOutput> {
  return parseAssignmentFlow(input);
}

const parseAssignmentPrompt = ai.definePrompt({
  name: 'parseAssignmentPrompt',
  input: {schema: ParseAssignmentInputSchema},
  output: {schema: AssignmentSchema},
  prompt: `You are an AI assistant that extracts structured information from a natural language assignment description.

  The output should be a JSON object with the following keys:
  - task: The title or name of the task.
  - dueDate: The due date of the assignment in ISO format (YYYY-MM-DD). If no year is specified, assume the current year.
  - course: The course the assignment is for, if specified.
  - details: Any additional details about the assignment, if specified.

  Today's date is {{currentDate}}.

  Example Input: "Write essay for history class due next Friday"
  Example Output: { "task": "Write essay", "dueDate": "2024-07-26", "course": "history class" }

  Now, extract the information from the following assignment description:
  {{assignmentText}}`,
});

const parseAssignmentFlow = ai.defineFlow(
  {
    name: 'parseAssignmentFlow',
    inputSchema: ParseAssignmentInputSchema,
    outputSchema: AssignmentSchema,
  },
  async input => {
    const {output} = await parseAssignmentPrompt({
        ...input,
        currentDate: new Date().toLocaleDateString('en-CA'),
    });
    return output!;
  }
);
