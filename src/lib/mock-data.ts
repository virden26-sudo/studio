import type { Assignment, Course, ScheduleEvent } from './types';

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Quantum Physics Problem Set',
    course: 'Physics 301',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    completed: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Shakespeare Essay',
    course: 'English Lit 202',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    completed: false,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Calculus Midterm Prep',
    course: 'Math 210',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: false,
    priority: 'high',
  },
  {
    id: '4',
    title: 'Lab Report: Photosynthesis',
    course: 'Biology 101',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    completed: true,
    priority: 'medium',
  },
    {
    id: '5',
    title: 'History Presentation Outline',
    course: 'History 110',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    completed: false,
    priority: 'low',
  },
];

export const mockCourses: Course[] = [
  { id: '1', name: 'Physics 301', grade: 88 },
  { id: '2', name: 'English Lit 202', grade: 92 },
  { id: '3', name: 'Math 210', grade: 95 },
  { id: '4', name: 'Biology 101', grade: 85 },
  { id: '5', name: 'History 110', grade: 90 },
];

export const mockSchedule: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Physics 301 Lecture',
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(10, 30, 0, 0)),
    type: 'class',
  },
  {
    id: '2',
    title: 'Work at Library',
    startTime: new Date(new Date().setHours(13, 0, 0, 0)),
    endTime: new Date(new Date().setHours(17, 0, 0, 0)),
    type: 'work',
  },
];
