
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AssignmentSchema } from '@/ai/schemas/assignment';

const AnnouncementSchema = z.object({
    title: z.string(),
    content: z.string(),
    date: z.string(), // ISO or human readable
    course: z.string(),
    important: z.boolean()
});

const DiscussionSchema = z.object({
    title: z.string(),
    content: z.string().optional(),
    dueDate: z.string().optional(),
    postedDate: z.string(),
    course: z.string(),
    author: z.string().optional()
});

const PortalParserInputSchema = z.object({
  portalText: z.string(),
  currentDate: z.string().optional(),
});

const PortalParserOutputSchema = z.object({
    assignments: z.array(AssignmentSchema),
    announcements: z.array(AnnouncementSchema),
    discussions: z.array(DiscussionSchema)
});

export async function parsePortalData(input: { portalText: string }): Promise<z.infer<typeof PortalParserOutputSchema>> {
  return parsePortalFlow(input);
}

const portalParserPrompt = ai.definePrompt({
  name: 'portalParserPrompt',
  input: {schema: PortalParserInputSchema},
  output: {schema: PortalParserOutputSchema},
  model: 'ollama/budd-ie:latest',
  prompt: `You are an expert AI assistant that extracts academic information from a student portal's raw text dump.

  Extract all:
  1. Assignments and Quizzes/Exams (including due dates and courses)
  2. Announcements (title, content, date, course, and if it seems important)
  3. Discussions (title, due date if any, posted date, course, and author if specified)

  Today's date is {{currentDate}}.

  Raw Portal Text:
  {{portalText}}
  `,
});

const parsePortalFlow = ai.defineFlow(
  {
    name: 'parsePortalFlow',
    inputSchema: PortalParserInputSchema,
    outputSchema: PortalParserOutputSchema,
  },
  async input => {
    const {output} = await portalParserPrompt({
      ...input,
      currentDate: new Date().toLocaleDateString('en-CA'),
    });
    return output!;
  }
);
