'use server';

/**
 * @fileOverview An AI agent that suggests optimal study times based on a student's schedule,
 * assignment difficulty, and due dates.
 *
 * - suggestStudySchedule - A function that handles the study schedule suggestion process.
 * - StudyScheduleInput - The input type for the suggestStudySchedule function.
 * - StudyScheduleOutput - The return type for the suggestStudySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyScheduleInputSchema = z.object({
  schedule: z
    .string()
    .describe(
      'The student schedule as a JSON string. Should include day of the week, start time, and end time for each commitment (e.g., classes, work).'
    ),
  assignments: z
    .string()
    .describe(
      'A list of assignments as a JSON string. Should include assignment name, due date, and estimated difficulty (e.g., easy, medium, hard).'
    ),
});
export type StudyScheduleInput = z.infer<typeof StudyScheduleInputSchema>;

const StudyScheduleOutputSchema = z.object({
  suggestedSchedule: z
    .string()
    .describe(
      'A JSON string containing suggested study schedule. Should include day of the week, start time, end time, and the assignment to work on during that time.'
    ),
  reasoning: z
    .string()
    .describe(
      'A string containing the reasoning for the suggested schedule.'
    ),
});
export type StudyScheduleOutput = z.infer<typeof StudyScheduleOutputSchema>;

export async function suggestStudySchedule(
  input: StudyScheduleInput
): Promise<StudyScheduleOutput> {
  return suggestStudyScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStudySchedulePrompt',
  input: {schema: StudyScheduleInputSchema},
  output: {schema: StudyScheduleOutputSchema},
  prompt: `You are an AI assistant that helps students create optimal study schedules.

You will be provided with the student's schedule and a list of assignments with their due dates and difficulty.

Based on this information, you will suggest optimal study times for each assignment.
Consider the difficulty of the assignment and the due date when making your suggestions. The earlier the due date and the harder the assignment, the earlier you should start working on it.
Schedule in breaks of at least 10 minutes per hour.
Take into account the student's existing schedule and avoid scheduling study times during those times.

Student Schedule: {{{schedule}}}

Assignments: {{{assignments}}}

Output the suggested schedule as a JSON string, and explain the reasoning for your suggestions.

Remember to be concise, helpful and encouraging. Focus on actionable next steps for the student.

Output format:
{
  "suggestedSchedule": "...JSON string of schedule...",
  "reasoning": "...Explanation of the suggested schedule..."
}
`,
});

const suggestStudyScheduleFlow = ai.defineFlow(
  {
    name: 'suggestStudyScheduleFlow',
    inputSchema: StudyScheduleInputSchema,
    outputSchema: StudyScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
