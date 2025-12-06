import { z } from 'zod';

export const AssignmentSchema = z.object({
  task: z.string().describe('The title or name of the task.'),
  dueDate: z
    .string()
    .describe('The due date of the assignment in ISO format (YYYY-MM-DD).'),
  course: z.string().optional().describe('The course the assignment is for.'),
  details: z
    .string()
    .optional()
    .describe('Any additional details about the assignment.'),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
