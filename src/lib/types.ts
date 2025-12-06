export type Assignment = {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  details?: string;
};

export type Course = {
  id: string;
  name: string;
  grade: number;
};

export type ScheduleEvent = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'class' | 'work' | 'study' | 'personal';
};

export type User = {
  name: string;
  avatarUrl: string;
};

// This is what the AI flow returns. The dueDate is a string.
export type ParsedAssignment = {
  task: string;
  dueDate: string; // ISO format
  course?: string;
  details?: string;
}
